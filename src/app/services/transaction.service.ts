import { Injectable, signal, inject, computed } from '@angular/core';
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
        creator:profiles!user_id(display_name),
        updater:profiles!updated_by(display_name)
      `)
      .order('transaction_date', { ascending: false });

    if (error) {
      alert(error.message);
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
        profiles: row.creator,
        updater_profile: row.updater
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

  async updateTransaction(id: string, updateData: any) {
    this.isLoading.set(true);
    const { data: userData } = await this.supabase.auth.getUser();

    const { error } = await this.supabase
      .from('transactions')
      .update({
        type: updateData.type,
        amount: updateData.type === 'expense' ? -Math.abs(updateData.amount) : Math.abs(updateData.amount),
        transaction_date: updateData.transactionDate,
        note: updateData.note,
        updated_by: userData.user?.id
      })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      await this.fetchTransactions();
    }
    this.isLoading.set(false);
  }

  async deleteTransaction(id: string) {
    this.isLoading.set(true);
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      await this.fetchTransactions();
    }
    this.isLoading.set(false);
  }

  async fetchDeletedTransactions() {
    const { data, error } = await this.supabase
      .from('recently_deleted_transactions')
      .select(`*, profiles:user_id(display_name)`)
      .order('deleted_at', { ascending: false });

    return data || [];
  }

  // Offline methods
  totalBalance = computed(() =>
    this.transactions().reduce((acc, t) => acc + t.amount, 0)
  );

  totalSavings = computed(() =>
    this.transactions()
      .filter(t => t.type === 'savings')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  totalExpenses = computed(() =>
    this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + Math.abs(t.amount), 0)
  );

  transactionCount = computed(() => this.transactions().length);
}
