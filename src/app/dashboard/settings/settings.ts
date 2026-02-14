import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogout() {
    await this.authService.logout();
    await this.router.navigate(['/login'], {replaceUrl: true});
  }
}
