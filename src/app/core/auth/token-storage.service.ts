import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthUser, LoginResponse } from '../../shared/models/auth.models';

const ACCESS_TOKEN_KEY = 'financist.access_token';
const USER_KEY = 'financist.user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getAccessToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    if (!this.isBrowser()) {
      return null;
    }

    const serialized = localStorage.getItem(USER_KEY);
    return serialized ? (JSON.parse(serialized) as AuthUser) : null;
  }

  persistSession(response: LoginResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        fullName: response.fullName,
        email: response.email
      } satisfies AuthUser)
    );
  }

  clearSession(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
