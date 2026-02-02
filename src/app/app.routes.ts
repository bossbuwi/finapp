import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './dashboard/home/home';
import { TransactionsComponent } from './dashboard/transactions/transactions';
import { SettingsComponent } from './dashboard/settings/settings';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard.guestGuard] // Users can't see this if logged in
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [authGuard.guestGuard] // Users can't see this if logged in
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard.canActivate],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' } // Default child
    ]
  }
];
