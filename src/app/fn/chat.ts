/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from 'C:/Users/User/Project/src/app/strict-http-response';
import { RequestBuilder } from 'C:/Users/User/Project/src/app/request-builder';
import { SendMessageRequest } from './../models/chat-request';
import { ChatMessage } from './../models/chat-message';

export interface SendMessage$Params {
    body: SendMessageRequest;
  }

export function sendMessage(http: HttpClient, baseUrl: string, params: SendMessage$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
  const rb = new RequestBuilder(baseUrl, sendMessage.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<{}>;
    })
  );
}

sendMessage.PATH = '/chat/send';

export interface GetChatMessages$Params {
  ticketId: number;
}

export function getChatMessages(http: HttpClient, baseUrl: string, params: GetChatMessages$Params, context?: HttpContext): Observable<StrictHttpResponse<ChatMessage[]>> {
  const rb = new RequestBuilder(baseUrl, getChatMessages.PATH, 'get');
  if (params) {
    rb.query('ticketId', params.ticketId);
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ChatMessage[]>;
    })
  );
}

getChatMessages.PATH = '/chat/messages';
