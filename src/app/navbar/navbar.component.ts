import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {AuthService} from "../services/auth.service";
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(public authService: AuthService) { }

  ngOnInit() {}
}


