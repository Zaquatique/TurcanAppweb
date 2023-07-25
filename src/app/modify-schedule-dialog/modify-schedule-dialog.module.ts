import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifyScheduleDialogPageRoutingModule } from './modify-schedule-dialog-routing.module';

import { ModifyScheduleDialogPage } from './modify-schedule-dialog.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModifyScheduleDialogPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [ModifyScheduleDialogPage]
})
export class ModifyScheduleDialogPageModule {}
