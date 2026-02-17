import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  private fb = inject(FormBuilder);

  // Track selected type locally before submission
  type: TransactionType = 'expense';

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    // Default to today's date in YYYY-MM-DD format
    transactionDate: [new Date().toISOString().split('T')[0], Validators.required],
    note: ['']
  });

  setType(val: TransactionType) {
    this.type = val;
  }

  onSubmit() {
    if (this.form.valid) {
      // Emit the form values plus the selected type
      this.saved.emit({
        ...this.form.value,
        type: this.type
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
