import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {MessageService} from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject qui émet la valeur actuelle de isLoggedIn à chaque nouveau souscripteur
  private isLoggedInSource = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSource.asObservable();

  checkLoginStatus(): boolean {
    return localStorage.getItem('user_id') !== null;
  }

  setLoggedIn(): void {
    // Mettre à jour la source de données pour isLoggedIn
    this.isLoggedInSource.next(true);
  }

  setLoggedOut(): void {
    // Mettre à jour la source de données pour isLoggedIn
    this.isLoggedInSource.next(false);
    // Supprimer les informations d'utilisateur du localStorage lors de la déconnexion
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    localStorage.removeItem('session_token');
  }
}

