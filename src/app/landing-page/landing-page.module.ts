import { NgModule } from '@angular/core';
import {AsyncPipe, CommonModule, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPagePageRoutingModule } from './landing-page-routing.module';

import { LandingPagePage } from './landing-page.page';
import { LoginPageModule } from '../login/login.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LandingPagePageRoutingModule,
    AsyncPipe,
    NgIf,
    LoginPageModule,

  ],
  declarations: [LandingPagePage]
})
export class LandingPagePageModule {}
