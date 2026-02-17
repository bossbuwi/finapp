import { Injectable, signal, effect } from '@angular/core';
import { Transaction, TransactionType } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly STORAGE_KEY = 'app_transactions';

  // Signal to hold the list of transactions
  transactions = signal<Transaction[]>(this.loadFromStorage());

  constructor() {
    // Automatically save to LocalStorage whenever the signal changes
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactions()));
    });
  }

  addTransaction(data: { type: TransactionType; amount: number; transactionDate: string; note?: string }) {
    const now = new Date().toISOString();

    // Requirement #2: Savings positive, Expense negative
    const finalAmount = data.type === 'expense'
      ? -Math.abs(data.amount)
      : Math.abs(data.amount);

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: data.type,
      amount: finalAmount,
      transactionDate: data.transactionDate,
      createdAt: now,      // Auto-added (Req #3)
      updatedAt: now,      // Auto-added (Req #4)
      note: data.note
    };

    this.transactions.update(prev => [newTransaction, ...prev]);
  }

  private loadFromStorage(): Transaction[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}
