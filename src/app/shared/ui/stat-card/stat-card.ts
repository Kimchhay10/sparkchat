import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardData {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  readonly data = input.required<StatCardData>();
  readonly loading = input<boolean>(false);

  getTrendColor(): string {
    const trend = this.data().trend;
    if (trend === 'up') return 'text-brand';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  }

  getTrendIcon(): string {
    const trend = this.data().trend;
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  }
}
