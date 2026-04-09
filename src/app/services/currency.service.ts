import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly STORAGE_KEY = 'app_currency_code';

  // Initialize from Local Storage or default to USD
  selectedCurrency = signal<string>(localStorage.getItem(this.STORAGE_KEY) || 'USD');

  setCurrency(code: string) {
    this.selectedCurrency.set(code);
    localStorage.setItem(this.STORAGE_KEY, code);
  }
}
