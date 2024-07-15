import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private jwtHelper = new JwtHelperService();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  set token(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
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
      // Check if token is expired
      const isTokenExpired = this.jwtHelper.isTokenExpired(token);
      if (isTokenExpired) {
        localStorage.clear();
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
    if (isPlatformBrowser(this.platformId)) {
      const token = this.token;
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        return decodedToken.authorities || []; // Adjust based on the structure of your token
      }
    }
    return [];
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
}
