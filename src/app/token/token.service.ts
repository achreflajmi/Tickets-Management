import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private jwtHelper = new JwtHelperService();
  private _userRoles: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  set token(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this._userRoles = this.decodeRoles(token); // Set roles when token is set
    }
  }

  get token(): string {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token ? token : '';
    }
    return '';
  }

  isTokenValid(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.token;
      if (!token) {
        return false;
      }
      const isTokenExpired = this.jwtHelper.isTokenExpired(token);
      if (isTokenExpired) {
        localStorage.clear();
        this._userRoles = []; // Clear roles on token expiry
        return false;
      }
      return true;
    }
    return false; // Handle non-browser environment
  }

  isTokenNotValid(): boolean {
    return !this.isTokenValid();
  }

  get userRoles(): string[] {
    return this._userRoles; // Return roles stored in the service
  }

  private decodeRoles(token: string): string[] {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.roles || []; // Adjust based on the structure of your token
  }
  

  getConnectedUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.token;
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.userId || null; // Adjust based on your token structure
      }
    }
    return null;
  }

  getConnectedUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.token;
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.sub || null; // Adjust based on the structure of your token
      }
    }
    return null;
  }

  clearToken() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this._userRoles = []; // Clear user roles on logout
    }
  }

  
  set userRoles(roles: string[]) {
    this._userRoles = roles; // Allow setting user roles directly
  }
  

}
