import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-transaction-list-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-btn" (click)="close.emit()">&times;</button>
        </div>

        <div class="list-body">
          @for (item of transactions; track item.id) {
            <div class="list-item clickable" (click)="select.emit(item)">
              <div class="item-info">
                <span class="item-name">{{ item.transactionName || 'Unnamed' }}</span>
                <span class="item-date">{{ item.transactionDate | date:'mediumDate' }}</span>
              </div>
              <span class="item-amount" [class]="item.type">
                {{ item.amount | currency }}
              </span>
            </div>
          } @empty {
            <p class="empty-text">No transactions found.</p>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./transaction-list-modal.component.css']
})
export class TransactionListModalComponent {
  @Input({ required: true }) title: string = '';
  @Input({ required: true }) transactions: Transaction[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<Transaction>();
}
