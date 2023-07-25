import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleDayDialogPage } from './schedule-day-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleDayDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleDayDialogPageRoutingModule {}
