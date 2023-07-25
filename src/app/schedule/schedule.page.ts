import {ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {ActionSheetController, ModalController} from '@ionic/angular';

import {ScheduleDayDialogPage} from "../schedule-day-dialog/schedule-day-dialog.page";
import {CreateScheduleDialogPage} from "../create-schedule-dialog/create-schedule-dialog.page";
import {ModifyScheduleDialogPage} from "../modify-schedule-dialog/modify-schedule-dialog.page";

import {DatePipe, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';

//--Services---//
import {AuthService} from "../services/auth.service";
import {ProfilService} from "../services/profil.service";
import { ScheduleService } from '../services/schedule.service';

//----Models----//
import {ScheduleResponse} from "../models/Schedule-response";

//----Calendrier Import------//
import {CalendarOptions, Calendar, EventClickArg, EventApi, ViewApi, EventInput} from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction'; // for dateClick
import listPlugin from '@fullcalendar/list';

//----PDF import-------//
import  jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'





registerLocaleData(localeFr, 'fr');


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss']
})


export class SchedulePage implements OnInit, AfterViewInit {

  // displayedColumns: string[] = [ 'date', 'travel_time', 'load_status', 'unload_status', 'arrival_time', 'departure_time', 'break_time','panier', 'grand_deplacement', 'work_location', ];
  // dataSource!: MatTableDataSource<Schedule>;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  userNames: string[] = [];
  selectedUser = '';
  role: string|null='';
  nameUser!: string;


  constructor(
    // private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private authService : AuthService,
    private userService: ProfilService,
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) { }

  //Calendrier
  eventsLoaded = false;

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  totalWorkHours = 0;
  totalPanier = 0;
  totalGrandDeplacement = 0;
  currentViewTitle!: string;

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: '',
      center: '',
      right: ''
    },
    initialView: 'dayGridWeek',
    locale: 'fr',
    titleFormat: {year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'},
    firstDay: 1,
    hiddenDays: [6, 0], // cache le samedi et le dimanche
    events: [],  // initialize as empty array
    // eventClick: this.openScheduleDialog.bind(this),
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    editable: false,
    height: 'auto',  // définir la hauteur à 700px,


    //affiche la bulle de dialog correspondante ajout/modifier event
    eventClick: (clickInfo) => {
      this.openActionSheet({
        event: clickInfo.event,
        el: clickInfo.el,
        jsEvent: clickInfo.jsEvent,
        view: clickInfo.view
      });
    },
    dateClick: (clickInfo) => {
      // Get the clicked date
      let clickedDate = clickInfo.date;

      // Get all events from the calendar
      let calendarApi = clickInfo.view.calendar;
      let allEvents = calendarApi.getEvents();

      // Find if there's already an event for the clicked date
      let eventForClickedDate = allEvents.find((event) => {
        return event.start && event.start.toISOString() === clickedDate.toISOString();
      });

      if (!eventForClickedDate) {
        // If no event exists for the clicked date, open the add schedule dialog
        this.openAddScheduleDialog(clickInfo);
      }
    },
    datesSet: (view) => {
      this.calculateTotalWorkHours(view);
      const calendarApi = this.calendarComponent.getApi();
      this.currentViewTitle = calendarApi.view.title;
    },


    eventContent: function(arg) {
      var arrayOfDomNodes = [];

      var titleEl = document.createElement('div');
      titleEl.classList.add('fc-event-title');
      titleEl.innerHTML = arg.event.title;
      arrayOfDomNodes.push(titleEl);

      var subtitleEl = document.createElement('div');
      subtitleEl.classList.add('fc-event-subtitle');
      subtitleEl.innerHTML = arg.event.extendedProps['subtitle'];
      arrayOfDomNodes.push(subtitleEl);

      var validationEl = document.createElement('div');
      validationEl.classList.add('fc-event-validation');
      validationEl.innerHTML = arg.event.extendedProps['validation'];
      arrayOfDomNodes.push(validationEl);

      return {domNodes: arrayOfDomNodes};
    }

  }
  //-----------------------FIN-OPTIONS------------------------------------//


  ngOnInit() {

    // this.authService.setLoggedIn(); // après une connexion réussie

    //récupérer les roles et users
    this.role = this.userService.getUserRole();
      if(this.role =='administrateur'){
        this.scheduleService.getAllNames().subscribe(names => {
          this.userNames = names;
        });
      }
      this.loadEvents();

  }
  ngAfterViewInit() {
    const calendarApi = this.calendarComponent.getApi();  // Get the calendar API
    const view = calendarApi.view;  // Get the current view
    this.calculateTotalWorkHours(view);
  }

  //---------Boutons navigation-------------------------//
  goToPrevMonth(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();
  }

  goToNextMonth(): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }

  changeView(viewType: string): void {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.changeView(viewType);
  }

  goToToday(): void {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.today();
  }




  //-----------------------------Séléction de l'User-------------------------------//
  onUserChange() {
    if(!this.selectedUser){
      this.loadEvents();
    }else{
      this.scheduleService.getSchedulesForUser(this.selectedUser).subscribe((response: ScheduleResponse) => {
        this.calendarOptions.events = response.data.map(item => {
          // Create a common event object
          let event = {
            id: item.id,
            title: item.total_work_time + ' heures', // default title
            subtitle: item.commentaire,
            validation: '',
            date: item.date,
            status: item.status,
            // Mapping the rest of the keys to your interface
            travel_time: item.travel_time,
            load_status: item.load_status,
            unload_status: item.unload_status,
            arrival_time: item.arrival_time,
            departure_time: item.departure_time,
            break_time: item.break_time,
            panier: item.panier,
            grand_deplacement: item.grand_deplacement,
            work_location: item.work_location,
            total_work_time: item.total_work_time,
            commentaire: item.commentaire,
            validated:  item.validated,

            // Style properties
            color: 'blue',
            textColor: 'black',
            backgroundColor: '#92dde1',
            borderColor: 'darkblue',
            classNames: ['my-custom-class'],
            display: 'block',
          };

          if (item.status === 'absence') {
            event.title = 'Absent';
            event.color = 'red';
          } else if (item.status === 'conge') {
            event.title = 'Congé';
            event.color = 'green';
          }
          //validation
          if (item.validated == '1') {

            event.validation += ' Validé ✅';
            event.borderColor= '#39ff00';

          } else {
            event.validation += ' Non validé ❌';
            event.borderColor= '#ff0000';
          }

          // If not an admin, modify the title
          if(this.role == 'administrateur') {
            event.title = item.firstName+ ' : '+item.total_work_time +' heures';
          }

          return event;
        });
      });
    }

  }


  //--------Charge les horaires ( si admin charge tous les horaires, sinon charge que User_id-------//
  loadEvents() {
    this.scheduleService.getSchedules().subscribe((response: ScheduleResponse) => {
      this.calendarOptions.events = response.data.map(item => {
        // Create a common event object
        this.nameUser = item.firstName;
        let event = {
          id: item.id,
          title: item.total_work_time + ' heures', // default title
          subtitle: item.commentaire,
          validation: '',

          // Mapping the rest of the keys to your interface*
          date: item.date,
          status: item.status,
          firstName: item.firstName,
          travel_time: item.travel_time,
          load_status: item.load_status,
          unload_status: item.unload_status,
          arrival_time: item.arrival_time,
          departure_time: item.departure_time,
          break_time: item.break_time,
          panier: item.panier,
          grand_deplacement: item.grand_deplacement,
          work_location: item.work_location,
          total_work_time: item.total_work_time,
          commentaire: item.commentaire,
          validated: item.validated,

          // Style properties
          color: 'blue',
          textColor: 'black',
          backgroundColor: '#92dde1',
          borderColor: 'darkblue',
          classNames: ['my-custom-class'],
          display: 'block',

        };

        // Adjust the color and title of the event based on the status
        if (item.status === 'absence') {
          event.title = 'Absent';
          event.backgroundColor = '#ff9595' ;
        } else if (item.status === 'conge') {
          event.title = 'Congé';
          event.backgroundColor = 'lightgreen';
        }
        //validation
        if (item.validated == '1') {

          event.validation += ' Validé ✅';
          event.borderColor= '#39ff00';

        } else {
          event.validation += ' Validé ❌';
          event.borderColor= '#ff0000';
        }

        // If not an admin, modify the title
        if(this.role == 'administrateur') {
          event.title = item.firstName+ ' : '+item.total_work_time +' heures';
        }

        return event;
      })
      this.eventsLoaded = true;
    });

  }



  async openAddScheduleDialog(arg: DateClickArg) {
    // Open the add schedule dialog
    const modal = await this.modalController.create({
      component: CreateScheduleDialogPage,
      componentProps: {
        date: arg.dateStr
      }
    });

    return await modal.present();
  }

  //affiche la fenetre de l'event
  async openActionSheet(event: any) {
    let buttons = [
      {
        text: 'Voir horaire',
        handler: () => {
          this.openScheduleDialog(event);
        }
      },
      {
        text: 'Modifier',
        handler: () => {
          this.openModifyScheduleDialog(event);
        }
      },
      {
        text: 'Supprimer',
        role: 'destructive',
        handler: () => {
          this.scheduleService.removeSchedule(event.event._def.publicId).subscribe(
            response => {
              console.log("Delete response:", response);
            },
            error => {
              console.error("Delete error:", error);
            }
          );
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel'
        }
      }

    ];

    if(this.role === 'administrateur') {
      buttons.push({
        text: 'Valider',
        role: 'valider',
        // Ajoutez ici la logique pour valider l'événement
        handler: () => {
          this.scheduleService.validateSchedule(event.event._def.publicId).subscribe(
            response => {
              console.log("Validate response:", response);
            },
            error => {
              console.error("Validate error:", error);
            }
          );
        }
      });
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: buttons
    });

    await actionSheet.present();
  }

  async openScheduleDialog(event: any) {
    const modal = await this.modalController.create({
      component: ScheduleDayDialogPage,
      componentProps: {
        event: event
      }
    });

    return await modal.present();
  }

  async openModifyScheduleDialog(event: any) {
    const modal = await this.modalController.create({
      component: ModifyScheduleDialogPage, // This should be your modify dialog component
      componentProps: {
        event: event
      }
    });

    return await modal.present();
  }

  // Définissez la méthode en dehors de calendarOptions
  calculateTotalWorkHours(view: any): void {
    // Check if events have been loaded before calculating total work hours
    if (this.eventsLoaded) {
      let viewStart =view.start;
      let viewEnd = view.end;

      this.totalWorkHours = 0;  // Reset total work hours
      this.totalPanier = 0;
      this.totalGrandDeplacement = 0;

      let calendarApi = this.calendarComponent.getApi();
      let events = calendarApi.getEvents();

      events.forEach((event: any) => {
        if (event.start) {  // Check if event.start is defined
          let eventStart = new Date(event.start);


          if (eventStart >= viewStart && eventStart < viewEnd) {

            if (event.extendedProps && event.extendedProps['total_work_time']) {
              this.totalWorkHours += parseFloat(event.extendedProps['total_work_time']);  // Converted string to number
            }
            if (event.extendedProps && event.extendedProps['panier']=='1') {
              this.totalPanier +=1;
            }
            if (event.extendedProps && event.extendedProps['grand_deplacement']=='1') {
              this.totalGrandDeplacement +=1;
            }
          }
        }

      });
    }
  }

  //----------------PDF----------------//
  generatePDF() {
    let doc = new jsPDF();

    // Ajoute le logo.
    //doc.addImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQv3Hcg4Ax8V6PC6UsY8_ISERwWTE2GaeVmCOr1hMKqA&s", 'JPEG', 15, 40, 180, 160);

    // Ajoute le titre.
    doc.setFontSize(20);
    doc.text('Horaires TURCAN', 15, 30);


    // Crée le tableau avec les événements.
    const calendarApi = this.calendarComponent.getApi();  // Get the calendar API
    const view = calendarApi.view;  // Get the current view
    let viewStart = view.activeStart;
    let viewEnd = view.activeEnd;
    let events = calendarApi.getEvents();

    const tableData: any[] = [];
    const datePipe = new DatePipe('fr');

    // Ajoute le nom d'utilisateur et la date.
    let formattedViewStart = datePipe.transform(viewStart, 'fullDate')
    doc.setFontSize(14);
    doc.text(`Nom d'utilisateur: ${this.nameUser}`, 15, 70);
    doc.text(`Date de vue: ${formattedViewStart}`, 15, 85);


    events.forEach((event: any) => {
      if (event.start) {  // Check if event.start is defined
        let eventStart = new Date(event.start);

        let formattedDate = datePipe.transform(eventStart, 'fullDate')

        if (eventStart >= viewStart && eventStart < viewEnd) {
          if (event.extendedProps && event.extendedProps['total_work_time']) {
            tableData.push([
              formattedDate,  // Date
              event.extendedProps.travel_time,
              event.extendedProps.load_status == "1",
              event.extendedProps.unload_status == "1",
              event.extendedProps.arrival_time,
              event.extendedProps.departure_time,
              event.extendedProps.break_time,
              event.extendedProps.panier == "1",
              event.extendedProps.grand_deplacement == "1",
              event.extendedProps.work_location ,
              event.extendedProps.total_work_time
            ]);
          }
        }
      }
    });

    // Ajoute le tableau au PDF.
    autoTable(doc,{
      head: [
        ['Date', 'Temps de trajet', 'Chargement', 'Dechargement', "Heure d'arrivée", 'Heure de départ', 'Temps de pause', 'Panier', 'Grand déplacement', 'Lieu', 'Temps de travail du jour']
      ],
      body: tableData,
      startY: 100
    });

    doc.save('rapport.pdf');
  }


}
