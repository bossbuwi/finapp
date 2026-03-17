import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { LoadingSpinnerComponent } from '../../ui/loading-spinner.component';
import { Transaction } from '../../models/transaction.model';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoadingSpinnerComponent, TransactionDetailComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedTransaction = signal<Transaction | null>(null);
  transactionService = inject(TransactionService);

  ngOnInit() {
    this.transactionService.fetchTransactions();
  }

  viewDetails(t: Transaction) {
    this.selectedTransaction.set(t);
  }

  closeDetails() {
    this.selectedTransaction.set(null);
  }
}
