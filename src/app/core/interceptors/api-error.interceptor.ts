import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const tokenStorage = inject(TokenStorageService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !request.url.includes('/auth/login') &&
        !request.url.includes('/auth/register')
      ) {
        tokenStorage.clearSession();
        void router.navigateByUrl('/auth/login');
      }

      console.error('Financist API error', error);
      return throwError(() => error);
    })
  );
};
