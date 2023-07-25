import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import {MessageService} from "./message.service";
import {ScheduleResponse} from "../models/Schedule-response";
import {codeSharp} from "ionicons/icons";


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private url = 'http://34.163.235.31/'; // Votre URL d'API ici
  constructor(private http: HttpClient, private messageService: MessageService) { }

  getSchedules(): Observable<any> {
    // Get user_id and user_role from localStorage
    const user_id = localStorage.getItem('user_id');
    const user_role = localStorage.getItem('user_role');

    // Send user_id and user_role in the request body
    return this.messageService.sendMessage('getAllDateforUser', { user_id, user_role });
  }


  createSchedule(Schedule_create: Partial<any>): Observable<any> {
    const user_id = localStorage.getItem('user_id');
    const user_name = localStorage.getItem('user_name');

    // Add user_id and user_name to the request data
    const data = {
      ...Schedule_create,
      user_id,
      user_name
    };
    return this.messageService.sendMessage('addSchedule', data);
  }

  modifySchedule(id: string, scheduleUpdate: Partial<any>): Observable<any> {
    // Prepare data to send to the server
    const data = {
      id,
      ...scheduleUpdate
    };

    return this.messageService.sendMessage('modifySchedule', data);
  }



  getSchedulesForUser(userName: string): Observable<ScheduleResponse> {
    return this.messageService.sendMessage(`getScheduleForUser`, {user_Name: userName});
  }

  removeSchedule(dateId : string){
    return this.messageService.sendMessage('delSchedule', {date_id: dateId});
  }

  validateSchedule(dateId : string){
    return this.messageService.sendMessage('validateSchedule', {date_id: dateId});
  }

  getAllNames(): Observable<string[]> {
    const user_role = localStorage.getItem('user_role');
    return this.messageService.sendMessage('getAllUsers', { user_role: user_role }).pipe(
      map(response => {
        if (response.data && Array.isArray(response.data)) {
          return response.data.map((user: { firstName: string }) => user.firstName);
        } else {
          throw new Error('User firstName not found in response');
        }
      }),
      catchError(error => {
        console.error('Error getting user names:', error);
        return of([]);
      })
    );
  }








}
