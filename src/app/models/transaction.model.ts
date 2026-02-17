export type TransactionType = 'savings' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  transactionDate: string; // ISO string chosen by user
  createdAt: string;       // Auto-added, immutable
  updatedAt: string;       // Auto-updated
  note?: string;           // Optional extra info
}
