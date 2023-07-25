import {Component, Inject, Input, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Schedule} from "../models/schedule.model";
import {ScheduleService} from "../services/schedule.service";
// import {ModifyScheduleComponent} from "../modify-schedule/modify-schedule.component";
import {DatePipe} from "@angular/common";
import {ProfilService} from "../services/profil.service";

@Component({
  selector: 'app-schedule-day-dialog',
  templateUrl: './schedule-day-dialog.page.html',
  styleUrls: ['./schedule-day-dialog.page.scss']

})
export class ScheduleDayDialogPage implements OnInit {
  event: any;
  schedule!: Schedule;
  role: string | null = '';

  constructor(navParams: NavParams,
              private modalController: ModalController,
              private scheduleService: ScheduleService,
              private userService: ProfilService,) {
    this.event = navParams.get('event');
  }

  ngOnInit() {
    if (this.event && this.event.event._def && this.event.event._def.extendedProps) {
      this.schedule = {
        id: this.event.event._def.publicId,
        userID: this.event.event._def.extendedProps.userID,
        firstName: this.event.event._def.extendedProps.firstName,
        date: new Date(this.event.event.start),
        status: this.event.event._def.extendedProps.status,
        travel_time: this.event.event._def.extendedProps.travel_time,
        load_status: this.event.event._def.extendedProps.load_status === "1",
        unload_status: this.event.event._def.extendedProps.unload_status === "1",
        arrival_time: this.event.event._def.extendedProps.arrival_time,
        departure_time: this.event.event._def.extendedProps.departure_time,
        break_time: this.event.event._def.extendedProps.break_time,
        panier: this.event.event._def.extendedProps.panier  === "1",
        grand_deplacement: this.event.event._def.extendedProps.grand_deplacement  === "1",
        work_location: this.event.event._def.extendedProps.work_location,
        total_work_time: this.event.event._def.extendedProps.total_work_time,
        validated: this.event.event._def.extendedProps.validated ,
        commentaire: this.event.event._def.extendedProps.commentaire,
      };
    }

    this.role = this.userService.getUserRole();

  }

  dismiss() {
    this.modalController.dismiss();
  }


}
