import { Injectable, signal, inject } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private supabase = inject(SupabaseService).client; // Use shared client
  private authService = inject(AuthService);
  // Signal for the UI to bind to
  transactions = signal<Transaction[]>([]);
  isLoading = signal<boolean>(false);

  constructor() {
    // Fetch transactions immediately if already logged in
    if (this.authService.isAuthenticated()) {
      this.fetchTransactions();
    }
  }

  async fetchTransactions() {
    this.isLoading.set(true);

    const { data, error } = await this.supabase
      .from('transactions')
      .select(`
        *,
        profiles (
          display_name
        )
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      console.error('Error fetching:', error.message);
    } else {
      const mappedData = (data as any[]).map(row => ({
        id: row.id,
        type: row.type,
        amount: row.amount,
        transactionDate: row.transaction_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        note: row.note,
        user_id: row.user_id,
        profiles: row.profiles
      }));

      this.transactions.set(mappedData);
    }
    this.isLoading.set(false);
  }

  async addTransaction(data: any) {
    this.isLoading.set(true);
    const { data: userData } = await this.supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { error } = await this.supabase
      .from('transactions')
      .insert({
        type: data.type,
        amount: data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount),
        transaction_date: data.transactionDate,
        note: data.note,
        user_id: user.id
      });

    if (error) {
      alert(error.message);
    } else {
      // Refresh the list after adding
      await this.fetchTransactions();
    }
    this.isLoading.set(false);
  }
}
