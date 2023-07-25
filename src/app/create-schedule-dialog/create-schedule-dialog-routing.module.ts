import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateScheduleDialogPage } from './create-schedule-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: CreateScheduleDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateScheduleDialogPageRoutingModule {}
