import { Component, EventEmitter, Output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-deleted-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Deleted Transactions</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <div class="history-list">
          @for (item of deletedItems(); track item.id) {
            <div class="history-item">
              <div class="item-main">
                <span class="type">{{ item.type | titlecase }}</span>
                <span class="amount" [class]="item.type">{{ item.amount | currency }}</span>
              </div>
              <div class="item-sub">
                Deleted by {{ item.profiles?.display_name }} on {{ item.deleted_at | date:'short' }}
              </div>
            </div>
          } @empty {
            <p class="empty">No deleted transactions found.</p>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./deleted-history.component.css']
})
export class DeletedHistoryComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  transactionService = inject(TransactionService);
  deletedItems = signal<any[]>([]);

  async ngOnInit() {
    const data = await this.transactionService.fetchDeletedTransactions();
    this.deletedItems.set(data);
  }
}
