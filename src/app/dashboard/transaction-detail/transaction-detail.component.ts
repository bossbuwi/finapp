import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-detail.component.html',
  styleUrl: './transaction-detail.component.css'
})
export class TransactionDetailComponent {
  @Input({ required: true }) transaction!: Transaction;
  @Output() close = new EventEmitter<void>();
  @Output() editRequest = new EventEmitter<Transaction>();
  protected authService = inject(AuthService);
}
