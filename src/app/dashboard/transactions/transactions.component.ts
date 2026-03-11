import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { Transaction } from '../../models/transaction.model';
import { LoadingSpinnerComponent } from '../../ui/loading-spinner.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, AddTransactionComponent, TransactionDetailComponent, LoadingSpinnerComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  transactionService = inject(TransactionService);
  showAddModal = signal(false);
  showEditModal = signal<Transaction | null>(null);
  selectedTransaction = signal<Transaction | null>(null);

  ngOnInit() {
    // Refresh list whenever this screen is opened
    this.transactionService.fetchTransactions();
  }

  handleAdd(data: any) {
    this.transactionService.addTransaction(data);
    this.showAddModal.set(false);
  }

  handleUpdate(data: any) {
    const transactionToUpdate = this.showEditModal();
    if (transactionToUpdate) {
      this.transactionService.updateTransaction(transactionToUpdate.id, data);
      this.showEditModal.set(null);
    }
  }

  viewDetails(t: Transaction) {
    this.selectedTransaction.set(t);
  }

  closeDetails() {
    this.selectedTransaction.set(null);
  }

  openEditModal(t: Transaction) {
    this.selectedTransaction.set(null); // Close detail view first
    this.showEditModal.set(t);           // Open the Edit modal
  }
}
