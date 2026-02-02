import { Injectable, signal } from '@angular/core';
import { LoginCredentials } from '../login/login-credentials';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'expense_tracker_auth';
  backendError = signal<string | null>(null);  // Track authentication state
  isAuthenticated = signal<boolean>(
    localStorage.getItem(this.STORAGE_KEY) === 'true' ||
    sessionStorage.getItem(this.STORAGE_KEY) === 'true'
  );

  login(credentials: LoginCredentials): boolean {
    if (credentials.username === 'error' || credentials.password === 'error') {
      this.backendError.set('Invalid username or password.');
      return false;
    }

    this.backendError.set(null);
    this.isAuthenticated.set(true); // Set to true on success

    if (credentials.rememberMe) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
    } else {
      sessionStorage.setItem(this.STORAGE_KEY, 'true');
    }
    return true;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
