import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'schedule',canActivate: [AuthGuard],
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'schedule-day-dialog', canActivate: [AuthGuard],
    loadChildren: () => import('./schedule-day-dialog/schedule-day-dialog.module').then( m => m.ScheduleDayDialogPageModule)
  },
  {
    path: 'create-schedule-dialog', canActivate: [AuthGuard],
    loadChildren: () => import('./create-schedule-dialog/create-schedule-dialog.module').then( m => m.CreateScheduleDialogPageModule)
  },
  {
    path: 'profil', canActivate: [AuthGuard],
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./landing-page/landing-page.module').then( m => m.LandingPagePageModule)
  },
  {
    path: 'modify-schedule-dialog',
    loadChildren: () => import('./modify-schedule-dialog/modify-schedule-dialog.module').then( m => m.ModifyScheduleDialogPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
