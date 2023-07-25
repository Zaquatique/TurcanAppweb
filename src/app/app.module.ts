import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";

import {FullCalendarModule} from "@fullcalendar/angular";
import {MessageService} from "./services/message.service";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NavbarComponent} from "./navbar/navbar.component";
import {AuthGuard} from "./guards/auth.guard";

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule,

  ],

  providers: [AuthGuard, {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    MessageService, DatePipe, {provide: LOCALE_ID, useValue: 'fr'}],
  bootstrap: [AppComponent],
  exports: [
    NavbarComponent
  ]
})
export class AppModule {}
