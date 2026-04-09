import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currency-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.css']
})
export class CurrencyModalComponent {
  @Input() currentCode = 'USD';
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<string>();

  currencies = [
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'USD', name: 'US Dollar' },
  ];
}
