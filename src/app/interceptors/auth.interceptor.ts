import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Skip token injection during server-side rendering — localStorage is not available
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.getToken();

  // Only attach token to requests going to our API
  if (token && req.url.includes('/api/')) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
