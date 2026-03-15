import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

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
  private transactionService = inject(TransactionService);

  onDelete() {
    if (confirm('Are you sure you want to delete this? It cannot be restored.')) {
      this.transactionService.deleteTransaction(this.transaction.id);
      this.close.emit();
    }
  }
}
