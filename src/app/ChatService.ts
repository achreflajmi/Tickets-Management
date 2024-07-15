import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ChatMessage } from './models/chat-message';
import { SendMessageRequest } from './models/chat-request';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly sendMessageUrl = 'http://localhost:8081/api/v1/chat/send';
  private readonly getChatMessagesUrl = 'http://localhost:8081/api/v1/chat';

  constructor(private http: HttpClient, private authService: AuthService) { }

  sendMessage(request: SendMessageRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });

    return this.http.post<any>(`${this.sendMessageUrl}?ticketId=${request.ticket.ticketId}`, request, { headers })
      .pipe(
        catchError(error => {
          console.error('Error sending message:', error);
          return throwError(error); // Ensure to re-throw the error for further handling
        })
      );
  }
  

  getChatMessages(ticketId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.getChatMessagesUrl}/${ticketId}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    });
  }
}
