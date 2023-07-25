import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleDayDialogPageRoutingModule } from './schedule-day-dialog-routing.module';

import { ScheduleDayDialogPage } from './schedule-day-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleDayDialogPageRoutingModule
  ],
  declarations: [ScheduleDayDialogPage]
})
export class ScheduleDayDialogPageModule {}
