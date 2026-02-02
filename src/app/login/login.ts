import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginCredentials } from './login-credentials';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected authService = inject(AuthService);

  showPassword = signal(false);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  constructor() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.authService.backendError()) {
        this.authService.backendError.set(null);
      }
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginCredentials = this.loginForm.value as LoginCredentials;

    const success = this.authService.login(credentials);
    if (success) {
      this.router.navigate([''], { replaceUrl: true });
    }
  }

  hasError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.touched && control?.invalid);
  }
}
