import { Injectable } from '@angular/core';
import {MessageService} from "./message.service";
import {catchError, from, Observable, of, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {locate} from "ionicons/icons";

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  constructor(private messageService: MessageService) { }

  getUserProfile(id: string): Observable<any> {
    return this.messageService.sendMessage('isLoggedIn', {id: id}).pipe(
      map(response => {
        if (response.status === 'error' ) {
          throw new Error(response.message);
        } else {
          return response.data;  // Récupérer les données de l'utilisateur de la réponse
        }
      }),
      catchError(error => {
        return throwError(error.message);
      })
    );
  }



  logout(): Observable<any> {
    return this.messageService.sendMessage('logout', {});
  }

  getUserRole(){
    return  localStorage.getItem('user_role');
  }





}
