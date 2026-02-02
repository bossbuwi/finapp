import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  private router = inject(Router);

  // Helper to check which route is active to show/hide the FAB
  isTransactionsPage(): boolean {
    return this.router.url === '/transactions';
  }

  addItem() {
    alert('Add transaction logic');
  }
}
