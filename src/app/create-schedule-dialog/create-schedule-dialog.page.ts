import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { ScheduleService } from "../services/schedule.service";
import { DatePipe } from '@angular/common';
import { ModalController, NavParams } from '@ionic/angular';



@Component({
  selector: 'app-create-schedule-dialog',
  templateUrl: './create-schedule-dialog.page.html',
  styleUrls: ['./create-schedule-dialog.page.scss']
})
export class CreateScheduleDialogPage implements OnInit {
  scheduleForm = this.fb.group({
    date: this.navParams.get('date'),
    travel_time: [''],
    status:[''],
    load_status: [false],
    unload_status: [false],
    arrival_time: ['', Validators.required],
    departure_time: ['', Validators.required],
    break_time: ['',Validators.required],
    panier: [false],
    grand_deplacement: [false],
    work_location: ['',Validators.required],
    commentaire:[''],
  });

  date!: string | null;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    public modalController: ModalController,
    public navParams: NavParams
  ) {}

  ngOnInit(): void {
    const datePipe = new DatePipe('fr');
    this.date = this.navParams.get('date');
    this.date = datePipe.transform(this.date, 'fullDate');
  }

  dismiss() {
    this.modalController.dismiss();
  }

  createSchedule() {
    if (this.scheduleForm.valid) {
      this.scheduleService.createSchedule(this.scheduleForm.value)
        .subscribe(response => {
          this.dismiss();  // Close the modal
        });
      // location.reload();
    }
  }

  addScheduleAbsence(){
    this.scheduleForm.patchValue({
      status: "absence"
    });
    this.scheduleService.createSchedule(this.scheduleForm.value).subscribe(() => {
      this.dismiss();  // Close the modal
    });
    location.reload();
  }

  addScheduleConge(){
    this.scheduleForm.patchValue({
      status: "conge"
    });
    this.scheduleService.createSchedule(this.scheduleForm.value).subscribe(() => {
      this.dismiss();  // Close the modal
    });
    location.reload();
  }
}
