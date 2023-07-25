import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyScheduleDialogPage } from './modify-schedule-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyScheduleDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyScheduleDialogPageRoutingModule {}
