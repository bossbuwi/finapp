import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { LoadingSpinnerComponent } from '../../ui/loading-spinner.component';
import { Transaction } from '../../models/transaction.model';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { TransactionListModalComponent } from '../../ui/transaction-list-modal.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoadingSpinnerComponent, TransactionDetailComponent, TransactionListModalComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  selectedTransaction = signal<Transaction | null>(null);
  showFilteredList = signal<boolean>(false);
  filteredTitle = signal<string>('');
  filteredItems = signal<Transaction[]>([]);
  transactionService = inject(TransactionService);

  ngOnInit() {
    this.transactionService.fetchTransactions();
  }

  openSavingsList() {
    const savings = this.transactionService.transactions().filter(t => t.type === 'savings');
    this.filteredTitle.set('Savings Transactions');
    this.filteredItems.set(savings);
    this.showFilteredList.set(true);
  }

  openItemDetails(t: Transaction) {
    this.showFilteredList.set(false); // Close list
    this.selectedTransaction.set(t);  // Open details
  }

  viewDetails(t: Transaction) {
    this.selectedTransaction.set(t);
  }

  closeDetails() {
    this.selectedTransaction.set(null);
  }
}
