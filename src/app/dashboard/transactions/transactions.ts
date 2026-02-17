import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { AddTransactionComponent } from '../add-transaction/add-transaction';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, AddTransactionComponent, TransactionDetailComponent],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent {
  transactionService = inject(TransactionService);

  showAddModal = signal(false);

  // Track which transaction is currently being viewed
  selectedTransaction = signal<Transaction | null>(null);

  handleAdd(data: any) {
    this.transactionService.addTransaction(data);
    this.showAddModal.set(false);
  }

  viewDetails(t: Transaction) {
    this.selectedTransaction.set(t);
  }

  closeDetails() {
    this.selectedTransaction.set(null);
  }
}
