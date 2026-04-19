import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(TokenStorageService).getAccessToken();

  if (!token || request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
