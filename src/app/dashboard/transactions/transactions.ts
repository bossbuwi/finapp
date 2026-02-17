import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, AddTransactionComponent],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class TransactionsComponent {
  transactionService = inject(TransactionService);
  showAddModal = signal(false);

  handleAdd(data: any) {
    this.transactionService.addTransaction(data);
    this.showAddModal.set(false);
  }
}
