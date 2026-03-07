import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { LoadingSpinnerComponent } from '../../ui/loading-spinner.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  transactionService = inject(TransactionService);

  ngOnInit() {
    this.transactionService.fetchTransactions();
  }
}
