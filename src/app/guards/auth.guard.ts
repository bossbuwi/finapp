import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export class authGuard {
  static canActivate: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
      return true;
    }
    return router.parseUrl('/login');
  };

  // Protects public routes (Login/Forgot Password)
  static guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
      // If logged in, send them to the dashboard instead
      return router.parseUrl('');
    }
    return true; // Allow access if NOT logged in
  };
}
