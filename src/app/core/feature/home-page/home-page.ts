import { Component, HostListener, inject, signal } from '@angular/core';
import { LangService } from '../../../services/lang-service';
import { ToastService } from '../../../services/toast-service';
import { CommonModule } from '@angular/common';
import { Card } from '../../../shared/ui/card/card';
import { Chart, ChartConfig } from '../../../shared/ui/chart/chart';
import { StatCard, StatCardData } from '../../../shared/ui/stat-card/stat-card';
import { DatatableComponent } from '../../../shared/components/datatable/datatable.component';
import { DataTableConfig } from '../../../shared/interface/datatable.interface';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, Card, Chart, StatCard, DatatableComponent, Button],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  standalone: true,
})
export class HomePageComponent {
  protected readonly langService = inject(LangService);
  private readonly toastService = inject(ToastService);

  // Stats Data
  stats: StatCardData[] = [
    {
      title: 'Active Youth',
      value: '12,450',
      change: 18.5,
      changeLabel: 'new this month',
      icon: '👨‍🎓',
      iconColor: 'bg-brand/10 text-brand',
      trend: 'up',
    },
    {
      title: 'Learning Hours',
      value: '48,920',
      change: 25.2,
      changeLabel: 'hours this week',
      icon: '📚',
      iconColor: 'bg-blue-100 text-blue-600',
      trend: 'up',
    },
    {
      title: 'Projects Active',
      value: '342',
      change: 12.3,
      changeLabel: 'community projects',
      icon: '🚀',
      iconColor: 'bg-purple-100 text-purple-600',
      trend: 'up',
    },
    {
      title: 'Startups Launched',
      value: '156',
      change: 23.5,
      changeLabel: 'youth businesses',
      icon: '💼',
      iconColor: 'bg-orange-100 text-orange-600',
      trend: 'up',
    },
  ];

  // Line Chart
  lineChartConfig: ChartConfig = {
    type: 'line',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: '#3b82f6',
        borderWidth: 2,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'Expenses',
        data: [8, 12, 10, 15, 14, 18],
        borderColor: '#ef4444',
        borderWidth: 2,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
    ],
    title: 'Revenue vs Expenses',
    showLegend: true,
    showGrid: true,
  };

  // Area Chart
  areaChartConfig: ChartConfig = {
    type: 'area',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Users',
        data: [30, 45, 38, 55, 48, 62, 58],
        borderColor: '#0e613d',
        backgroundColor: 'rgba(14, 97, 61, 0.2)',
        fill: true,
      },
    ],
    title: 'Weekly Active Users',
    showLegend: true,
    showGrid: true,
  };

  // Bar Chart
  barChartConfig: ChartConfig = {
    type: 'bar',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 78, 85, 92],
        backgroundColor: ['#3b82f6', '#0e613d', '#f59e0b', '#8b5cf6'],
      },
    ],
    title: 'Quarterly Sales',
    showLegend: false,
  };

  // Pie Chart
  pieChartConfig: ChartConfig = {
    type: 'pie',
    labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
    datasets: [
      {
        label: 'Traffic Sources',
        data: [45, 35, 15, 5],
        backgroundColor: ['#3b82f6', '#0e613d', '#f59e0b', '#ef4444'],
      },
    ],
    title: 'Traffic Distribution',
    showLegend: true,
  };

  // Doughnut Chart
  doughnutChartConfig: ChartConfig = {
    type: 'doughnut',
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        label: 'Product Sales',
        data: [30, 25, 25, 20],
        backgroundColor: ['#3b82f6', '#0e613d', '#f59e0b', '#8b5cf6'],
      },
    ],
    title: 'Product Distribution',
    showLegend: true,
  };

  // Recent Transactions Table
  transactionsTableConfig: DataTableConfig = {
    columns: [
      {
        key: 'id',
        label: 'ID',
        width: '80px',
        sortable: true,
      },
      {
        key: 'customer',
        label: 'Customer',
        sortable: true,
      },
      {
        key: 'product',
        label: 'Product',
        sortable: true,
      },
      {
        key: 'amount',
        label: 'Amount',
        type: 'currency',
        sortable: true,
        align: 'right',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        sortable: true,
        badgeColor: (value) => {
          const colors: any = {
            completed: 'bg-brand/10 text-brand',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
          };
          return colors[value] || 'bg-gray-100 text-gray-800';
        },
      },
      {
        key: 'date',
        label: 'Date',
        type: 'date',
        sortable: true,
      },
    ],
    data: [
      {
        id: 1,
        customer: 'John Doe',
        product: 'Premium Plan',
        amount: 99.99,
        status: 'completed',
        date: '2024-12-15',
      },
      {
        id: 2,
        customer: 'Jane Smith',
        product: 'Basic Plan',
        amount: 29.99,
        status: 'completed',
        date: '2024-12-15',
      },
      {
        id: 3,
        customer: 'Bob Johnson',
        product: 'Pro Plan',
        amount: 199.99,
        status: 'pending',
        date: '2024-12-14',
      },
      {
        id: 4,
        customer: 'Alice Brown',
        product: 'Premium Plan',
        amount: 99.99,
        status: 'failed',
        date: '2024-12-14',
      },
      {
        id: 5,
        customer: 'Charlie Wilson',
        product: 'Basic Plan',
        amount: 29.99,
        status: 'completed',
        date: '2024-12-13',
      },
      {
        id: 6,
        customer: 'Diana Prince',
        product: 'Pro Plan',
        amount: 199.99,
        status: 'completed',
        date: '2024-12-13',
      },
      {
        id: 7,
        customer: 'Ethan Hunt',
        product: 'Premium Plan',
        amount: 99.99,
        status: 'pending',
        date: '2024-12-12',
      },
      {
        id: 8,
        customer: 'Fiona Green',
        product: 'Basic Plan',
        amount: 29.99,
        status: 'completed',
        date: '2024-12-12',
      },
    ],
    showPagination: true,
    showSearch: true,
    defaultPageSize: 5,
    pageSizes: [5, 10, 20],
    striped: true,
    hoverable: true,
  };

  ngOnInit(): void {}

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement).isContentEditable
    ) {
      event.preventDefault();
    }
  }

  onTransactionClick(transaction: any): void {
    console.log('Transaction clicked:', transaction);
    this.toastService.info(
      'Transaction Selected',
      `You clicked on transaction #${transaction.id}`
    );
  }
}
