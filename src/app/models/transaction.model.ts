export type TransactionType = 'savings' | 'expense';

export interface Transaction {
  id: string;
  type: 'savings' | 'expense';
  amount: number;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  note?: string;
  user_id: string;         // The creator's ID
  profiles?: {             // Joined data from the profiles table
    display_name: string;
  };
}
