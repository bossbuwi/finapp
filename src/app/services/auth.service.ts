import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { LoginCredentials } from '../login/login-credentials';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  private readonly STORAGE_KEY = 'expense_tracker_auth';
  // Track errors
  backendError = signal<string | null>(null);
  // Track authentication state
  isAuthenticated = signal<boolean>(
    localStorage.getItem(this.STORAGE_KEY) === 'true' ||
    sessionStorage.getItem(this.STORAGE_KEY) === 'true'
  );

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          lock: async (_name: string, _acquireTimeout: number, callback: () => Promise<any>) => {
            return await callback();
          }
        }
      }
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        this.isAuthenticated.set(false);
      } else if (session) {
        this.isAuthenticated.set(true);
      }
    });
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    // Clear any existing errors
    this.backendError.set(null);

    // Attempt to login using Supabase
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.username,
      password: credentials.password,
    });

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
