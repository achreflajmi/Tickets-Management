import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { confirm } from './fn/confirm';
import { Confirm$Params } from './fn/confirm';
import { StrictHttpResponse } from './strict-http-response';
import { register } from './fn/register';
import { RegisterA$Params, registerA } from './fn/registerA';

import { Register$Params } from './fn/register';
import { authenticate } from './fn/authenticate';
import { Authenticate$Params } from './fn/authenticate';
import { AuthenticationResponse } from './models/authentication-response';
import { BaseService } from './base-service';
import { ApiConfiguration } from './api-configuration';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private jwtHelper: JwtHelperService;

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
        this.jwtHelper = new JwtHelperService();

  }

  private loggedInUser: any; // Define your user model or type

  /** Path part for operation `registerUser()` */
  static readonly RegisterUserPath = '';

  /** Path part for operation `registerAdmin()` */
  static readonly RegisterAdminPath = '';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerUser$Response(params: Register$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
    return register(this.http, this.rootUrl + AuthService.RegisterUserPath, params, context);
  }

  registerUser(params: Register$Params, context?: HttpContext): Observable<{}> {
    return this.registerUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<{}>): {} => r.body)
    );
  }

  registerAdmin$Response(params: RegisterA$Params, context?: HttpContext): Observable<StrictHttpResponse<{}>> {
    return registerA(this.http, this.rootUrl + AuthService.RegisterAdminPath, params, context);
  }

  registerAdmin(params: RegisterA$Params, context?: HttpContext): Observable<{}> {
    return this.registerAdmin$Response(params, context).pipe(
      map((r: StrictHttpResponse<{}>): {} => r.body)
    );
  }


  /** Path part for operation `authenticate()` */
  static readonly AuthenticatePath = '';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate$Response(params: Authenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return authenticate(this.http, this.rootUrl + AuthService.AuthenticatePath, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), use `authenticate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate(params: Authenticate$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params, context).pipe(
      tap((response: StrictHttpResponse<AuthenticationResponse>) => {
        console.log('Authentication Response:', response);
        this.loggedInUser = response.body.user; // Assuming user details are correctly received in response.body.user
      }),
      map((response: StrictHttpResponse<AuthenticationResponse>) => response.body)
    );
  }
  

  /** Path part for operation `confirm()` */
  static readonly ConfirmPath = '';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `confirm()` instead.
   *
   * This method doesn't expect any request body.
   */
  confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return confirm(this.http, this.rootUrl + AuthService.ConfirmPath, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), use `confirm$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  confirm(params: Confirm$Params, context?: HttpContext): Observable<void> {
    return this.confirm$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }
  getUserId(): number | undefined {
    const userId = localStorage.getItem('userId');
    return userId ? +userId : undefined; // Convert to number if possible
  }


  getCurrentUser(): Observable<User> {
    // Adjust the endpoint URL according to your backend API
    return this.http.get<User>(`${this.rootUrl}/auth/USER`).pipe(
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError('Unable to fetch current user details');
      })
    );
  }
  getLoggedInUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      // Get user details from backend using the token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      return this.http.get<User>(`${this.rootUrl}/auth/USER`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching user details:', error);
          return throwError('Error fetching user details');
        })
      );
    } else {
      return throwError('Token is expired or not present');
    }
  }
  
  
  
}
