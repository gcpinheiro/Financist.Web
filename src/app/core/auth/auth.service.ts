import { inject, Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../../shared/models/auth.models';
import { ApiService } from '../api/api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly accessTokenState = signal<string | null>(this.tokenStorage.getAccessToken());
  private readonly currentUserState = signal<AuthUser | null>(this.tokenStorage.getUser());

  readonly currentUser = this.currentUserState.asReadonly();
  readonly accessToken = this.accessTokenState.asReadonly();
  readonly isAuthenticated = computed(() => !!this.accessTokenState());

  login(payload: LoginRequest): Observable<LoginResponse> {
    if (environment.useMockData) {
      return of(this.buildMockResponse(payload.email, 'Gabriel Costa')).pipe(
        delay(550),
        tap((result) => this.persistSession(result))
      );
    }

    return this.api
      .post<LoginResponse, LoginRequest>('/auth/login', payload)
      .pipe(tap((result) => this.persistSession(result)));
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    if (environment.useMockData) {
      return of(this.buildMockResponse(payload.email, payload.fullName)).pipe(
        delay(650),
        tap((result) => this.persistSession(result))
      );
    }

    return this.api
      .post<LoginResponse, RegisterRequest>('/auth/register', payload)
      .pipe(tap((result) => this.persistSession(result)));
  }

  logout(redirect = true): void {
    this.tokenStorage.clearSession();
    this.accessTokenState.set(null);
    this.currentUserState.set(null);

    if (redirect) {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  private persistSession(response: LoginResponse): void {
    this.tokenStorage.persistSession(response);
    this.accessTokenState.set(response.accessToken);
    this.currentUserState.set({
      fullName: response.fullName,
      email: response.email
    });
  }

  private buildMockResponse(email: string, fullName: string): LoginResponse {
    return {
      accessToken: 'mock-jwt-token.financist.dashboard',
      expiresAtUtc: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      fullName,
      email
    };
  }
}
