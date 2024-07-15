/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from 'C:/Users/User/Project/src/app/strict-http-response';
import { RequestBuilder } from 'C:/Users/User/Project/src/app/request-builder';

import { RegistrationRequest } from './../models/registration-request';

export interface Register$Params {
      body: RegistrationRequest
}

export function register(http: HttpClient, baseUrl: string, params: Register$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
  const rb = new RequestBuilder(baseUrl, register.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<{
      }>;
    })
  );
}

register.PATH = '/auth/register';