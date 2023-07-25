import { Component, OnInit } from '@angular/core';
import {Schedule} from "../models/schedule.model";
import {ModalController, NavParams} from "@ionic/angular";
import {ScheduleService} from "../services/schedule.service";
import {ProfilService} from "../services/profil.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-modify-schedule-dialog',
  templateUrl: './modify-schedule-dialog.page.html',
  styleUrls: ['./modify-schedule-dialog.page.scss'],
})
export class ModifyScheduleDialogPage implements OnInit {

  event: any;
  schedule!: Schedule;
  role: string | null = '';
  editScheduleForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              navParams: NavParams,
              private modalController: ModalController,
              private scheduleService: ScheduleService,) {
    this.editScheduleForm = this.formBuilder.group({
      travel_time: ['', Validators.required],
      load_status: [false, Validators.required],
      unload_status: [false, Validators.required],
      arrival_time: ['', Validators.required],
      departure_time: ['', Validators.required],
      break_time: ['', Validators.required],
      panier: [false, Validators.required],
      grand_deplacement: [false, Validators.required],
      work_location: ['', Validators.required],
      commentaire: ['', Validators.required]
    });
    this.event = navParams.get('event');
  }


  ngOnInit() {
    if (this.event.event._def.extendedProps) {
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
      this.editScheduleForm.setValue({
        travel_time: this.schedule.travel_time || '',
        load_status: this.schedule.load_status || false,
        unload_status: this.schedule.unload_status || false,
        arrival_time: this.schedule.arrival_time || '',
        departure_time: this.schedule.departure_time || '',
        break_time: this.schedule.break_time || '',
        panier: this.schedule.panier || false,
        grand_deplacement: this.schedule.grand_deplacement || false,
        work_location: this.schedule.work_location || '',
        commentaire: this.schedule.commentaire || ''
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  modifySchedule() {
    if (this.editScheduleForm.valid) {
      this.scheduleService.modifySchedule(this.schedule.id, this.editScheduleForm.value)
        .subscribe(response => {
          this.dismiss();  // Close the modal
        });
      // location.reload();
    }
  }

}

