export type TransactionType = 'savings' | 'expense';

export interface Transaction {
  id: string;
  type: 'savings' | 'expense';
  amount: number;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  note?: string;
  user_id: string;
  updated_by?: string;
  profiles?: {
    display_name: string;
  };
  updater_profile?: {
    display_name: string;
  };
}
