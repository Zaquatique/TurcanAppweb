import {Component, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {interval} from "rxjs";
import {switchMap} from "rxjs/operators";



@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss']
})
export class LandingPagePage implements OnInit {
  users: any[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {

  }

}
