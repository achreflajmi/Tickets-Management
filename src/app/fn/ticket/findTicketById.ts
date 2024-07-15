/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';
import { TicketResponse } from '../../models/ticket-response';

export interface FindTicketById$Params {
  'ticket-id': string;
}

export function findTicketById(http: HttpClient, rootUrl: string, params: FindTicketById$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketResponse>> {
  const rb = new RequestBuilder(rootUrl, findTicketById.PATH.replace('{ticket-id}', String(params['ticket-id'])), 'get');

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: r.body as TicketResponse }) as StrictHttpResponse<TicketResponse>;
    })
  );
}

findTicketById.PATH = '/tickets/{ticket-id}';
