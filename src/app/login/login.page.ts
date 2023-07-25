import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  user = {login: '', password: ''};
  errorMessage: string | null = null;
  isLoggedInval$!: Observable<boolean>;

  constructor(private messageService: MessageService, private router: Router, private authService : AuthService ) { }


  ngOnInit() {
    this.isLoggedInval$ = this.authService.isLoggedIn$;
    this.isLoggedInval$.subscribe(loggedIn => {
      if (loggedIn) {
        // this.router.navigate(['/schedule']); // changez ceci à votre route de schedule
      }
    });

  }


  login(): void {
    if (!this.user.login && !this.user.password) {
      this.errorMessage = 'Veuillez remplir les champs login et mot de passe';
    } else if (!this.user.login) {
      this.errorMessage = 'Veuillez remplir le champs de login';
    } else if (!this.user.password) {
      this.errorMessage = 'Veuillez remplir le champs de mot de passe';
    } else {
      this.messageService.sendMessage('checkLogin', this.user).subscribe(
        response => {
          if (response.status === 'ok') {
            this.errorMessage = null;

            // Store the session token and user info in LocalStorage
            localStorage.setItem('session_token', response.data.token);
            localStorage.setItem('user_id', response.data.user_id);
            localStorage.setItem('user_name', response.data.user_name);
            localStorage.setItem('user_role', response.data.user_role);

            this.authService.setLoggedIn();

            this.router.navigateByUrl('/schedule');

          } else {
            this.errorMessage = response.error || 'Login/Mot de passe invalide.';
          }
        },
        error => {
          this.errorMessage = 'Erreur réseau ou serveur.';
          console.error('Network or server error', error);
        }
      );
    }

  }
}

