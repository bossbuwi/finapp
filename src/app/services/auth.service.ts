import { inject, Injectable, signal } from '@angular/core';
import { LoginCredentialsModel } from '../models/login-credentials.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService).client; // Use shared client
  private readonly STORAGE_KEY = 'expense_tracker_auth';
  // Track errors
  backendError = signal<string | null>(null);
  // Track authentication state
  isAuthenticated = signal<boolean>(
    localStorage.getItem(this.STORAGE_KEY) === 'true' ||
    sessionStorage.getItem(this.STORAGE_KEY) === 'true'
  );
  isLoading = signal<boolean>(false);

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.isAuthenticated.set(false);
      } else if (session) {
        this.isAuthenticated.set(true);
      }
    });
  }

  async login(credentials: LoginCredentialsModel): Promise<boolean> {
    // Clear any existing errors
    this.backendError.set(null);
    this.isLoading.set(true);
    // Attempt to login using Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.username,
      password: credentials.password,
    });
    this.isLoading.set(false);
    // Check for backend errors
    if (error) {
      this.backendError.set(error.message);
      return false;
    }

    // If login is successful
    // Set authenticated signal
    this.isAuthenticated.set(true);
    // Set storage (local or session)
    if (credentials.rememberMe) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
    } else {
      sessionStorage.setItem(this.STORAGE_KEY, 'true');
    }

    return true;
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    // Clear custom storage and authenticated signal
    this.isAuthenticated.set(false);
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
