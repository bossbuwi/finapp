import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginCredentialsModel } from '../models/login-credentials.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value as LoginCredentialsModel;
    const success = await this.authService.login(credentials);

    if (success) {
      await this.router.navigate(['/home'], {replaceUrl: true});
    }
  }

  hasError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.touched && control?.invalid);
  }
}
