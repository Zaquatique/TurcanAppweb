import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateScheduleDialogPageRoutingModule } from './create-schedule-dialog-routing.module';

import { CreateScheduleDialogPage } from './create-schedule-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateScheduleDialogPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateScheduleDialogPage]
})
export class CreateScheduleDialogPageModule {}
