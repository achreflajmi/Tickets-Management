/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BaseService } from './base-service';
import { ApiConfiguration } from './api-configuration';
import { StrictHttpResponse } from './strict-http-response';
import { AuthService } from './auth.service';

import { PageResponseTicketResponse } from './models/PageResponseTicketResponse';
import { TicketResponse } from './models/ticket-response';
import { saveTicket } from './fn/ticket/save-ticket';
import { SaveTicket$Params } from './fn/ticket/save-ticket';
import { updateTicket } from './fn/ticket/update-ticket';
import { UpdateTicket$Params } from './fn/ticket/update-ticket';
import { closeTicket } from './fn/ticket/close-ticket';
import { CloseTicket$Params } from './fn/ticket/close-ticket';
import { findTicketById } from './fn/ticket/findTicketById';
import { FindTicketById$Params } from './fn/ticket/findTicketById';
import { RequestBuilder } from './request-builder';
import { TicketRequest } from './models/ticket-request';

@Injectable({ providedIn: 'root' })
export class TicketService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient, private authService: AuthService) {
    super(config, http);
    
  }

  /** Path part for operation `saveTicket()` */
  static readonly SaveTicketPath = '/tickets';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveTicket()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveTicket$Response(params: SaveTicket$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust this based on your actual token handling
    });

    const rb = new RequestBuilder(this.rootUrl, TicketService.SaveTicketPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    rb.header('Authorization', 'Bearer ' + localStorage.getItem('token')); // Set the header in the request builder

    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveTicket$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveTicket(params: SaveTicket$Params, context?: HttpContext): Observable<number> {
    return this.saveTicket$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

  /** Path part for operation `updateTicket()` */
  static readonly UpdateTicketPath = '/tickets/{ticket-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateTicket()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateTicket$Response(params: UpdateTicket$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust this based on your actual token handling
    });

    const rb = new RequestBuilder(this.rootUrl, TicketService.UpdateTicketPath.replace('{ticket-id}', String(params.id)), 'patch');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    rb.header('Authorization', 'Bearer ' + localStorage.getItem('token')); // Set the header in the request builder

    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: parseFloat(String((r as HttpResponse<any>).body)) }) as StrictHttpResponse<number>;
      })
    );
  }

  updateTicket(params: UpdateTicket$Params, context?: HttpContext): Observable<number> {
    return this.updateTicket$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }


  /** Path part for operation `deleteTicket()` */
  // static readonly DeleteTicketPath = '/tickets/{id}';

  // /**
  //  * This method provides access to the full `HttpResponse`, allowing access to response headers.
  //  * To access only the response body, use `deleteTicket()` instead.
  //  *
  //  * This method doesn't expect any request body.
  //  */
  // deleteTicket$Response(id: number, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust this based on your actual token handling
  //   });
  
  //   const rb = new RequestBuilder(this.rootUrl, TicketService.DeleteTicketPath, 'delete');
  //   rb.path('id', id); // Set the ticket ID in the path
  
  //   rb.header('Authorization', 'Bearer ' + localStorage.getItem('token')); // Set the header in the request builder
  
  //   return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
  //     filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
  //     map((r: HttpResponse<any>) => {
  //       return (r as HttpResponse<void>).clone({ body: undefined }) as StrictHttpResponse<void>;
  //     })
  //   );
  // }
  
  // /**
  //  * This method provides access only to the response body.
  //  * To access the full response (for headers, for example), `deleteTicket$Response()` instead.
  //  *
  //  * This method sends `application/json` and handles request body of type `application/json`.
  //  */
  // deleteTicket(id: number, context?: HttpContext): Observable<void> {
  //   return this.deleteTicket$Response(id, context).pipe(
  //     map((r: StrictHttpResponse<void>): void => r.body)
  //   );
  // }
  
  /** Path part for operation `findTicketById()` */
  static readonly FindTicketByIdPath = '/tickets/{ticket-id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findTicketById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findTicketById$Response(params: FindTicketById$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketResponse>> {
    return findTicketById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findTicketById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findTicketById(params: FindTicketById$Params, context?: HttpContext): Observable<TicketResponse> {
    return this.findTicketById$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketResponse>): TicketResponse => r.body)
    );
  }

  /** Path part for operation `findAllTickets()` */
  static readonly FindAllTicketsPath = '/tickets';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findAllTickets()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllTickets$Response(params?: any, context?: HttpContext): Observable<StrictHttpResponse<PageResponseTicketResponse>> {
    return this.http.get<PageResponseTicketResponse>(`${this.rootUrl}${TicketService.FindAllTicketsPath}`, {
      observe: 'response',
      params,
      ...context,
    }).pipe(
      map((response: HttpResponse<PageResponseTicketResponse>) => {
        return {
          ...response,
          body: response.body || {} as PageResponseTicketResponse  // Handle null or undefined body
        } as StrictHttpResponse<PageResponseTicketResponse>;
      })
    );
  }
  

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findAllTickets$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findAllTickets(params?: any, context?: HttpContext): Observable<PageResponseTicketResponse> {
    return this.findAllTickets$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageResponseTicketResponse>): PageResponseTicketResponse => r.body)
    );
  }

  findTicketsByUser$Response(page: number, size: number, userId: string | number, context?: HttpContext): Observable<StrictHttpResponse<PageResponseTicketResponse>> {
    const params = { page: page.toString(), size: size.toString(), userId: userId.toString() };
    const url = `${this.rootUrl}/tickets/user`; // Construct the URL dynamically
    return this.http.get<PageResponseTicketResponse>(url, {
      observe: 'response',
      params,
      ...context,
    }).pipe(
      map((response: HttpResponse<PageResponseTicketResponse>) => {
        return {
          ...response,
          body: response.body || {} as PageResponseTicketResponse // Handle null or undefined body
        } as StrictHttpResponse<PageResponseTicketResponse>;
      })
    );
  }

  findTicketsByUser(page: number, size: number, userId: string | number, context?: HttpContext): Observable<PageResponseTicketResponse> {
    return this.findTicketsByUser$Response(page, size, userId, context).pipe(
      map((r: StrictHttpResponse<PageResponseTicketResponse>): PageResponseTicketResponse => r.body)
    );
  }
  loadTickets(): Observable<any> {
    const userId = this.authService.getUserId(); // Fetch logged-in user ID dynamically
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust this based on your actual token handling
    });

    return this.http.get<any>(`${this.rootUrl}/tickets/user?page=0&size=10&userId=${userId}`, { headers });
  }
  static readonly CloseTicketPath = '/tickets/{ticket-id}/close';

  closeTicket$Response(ticketId: number, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token') // Adjust based on your token handling
    });
  
    const rb = new RequestBuilder(this.rootUrl, TicketService.CloseTicketPath, 'post'); // Using 'post' method for closing ticket
    rb.path('ticket-id', ticketId); // Ensure to use 'ticket-id' correctly
  
    rb.header('Authorization', 'Bearer ' + localStorage.getItem('token')); // Set the header in the request builder
  
    return this.http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
      map((r: any) => {
        return new HttpResponse({ body: r.body, status: r.status, statusText: r.statusText }); // Create HttpResponse from the response body
      })
    );
  }
  
  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `closeTicket$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  closeTicket(ticketId: number, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    
    return this.closeTicket$Response(ticketId, context);
  }

}
