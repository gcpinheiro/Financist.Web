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
      const response = this.buildMockResponse(payload);
      return new Observable<LoginResponse>((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      }).pipe(
        delay(550),
        tap((result) => this.persistSession(result))
      );
    }

    return this.api
      .post<LoginResponse, LoginRequest>('/auth/login', payload)
      .pipe(tap((result) => this.persistSession(result)));
  }

  register(payload: RegisterRequest): Observable<void> {
    if (environment.useMockData) {
      return of(void 0).pipe(delay(650));
    }

    return this.api.post<void, RegisterRequest>('/auth/register', payload);
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
    this.currentUserState.set(response.user);
  }

  private buildMockResponse(payload: LoginRequest): LoginResponse {
    return {
      accessToken: 'mock-jwt-token.financist.dashboard',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
      user: {
        id: 'user-01',
        name: 'Gabriel Costa',
        email: payload.email,
        role: 'Finance Lead',
        initials: 'GC'
      }
    };
  }
}
