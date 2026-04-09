import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyModalComponent } from '../../ui/currency-modal.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, CurrencyModalComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  currencyService = inject(CurrencyService);
  showCurrencyModal = signal(false);

  handleCurrencySelect(code: string) {
    this.currencyService.setCurrency(code);
    this.showCurrencyModal.set(false);
  }

  async onLogout() {
    await this.authService.logout();
    await this.router.navigate(['/login'], {replaceUrl: true});
  }
}
