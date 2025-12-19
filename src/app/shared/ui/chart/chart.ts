import { Component, input, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
export type ChartSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartConfig {
  type: ChartType;
  labels: string[];
  datasets: ChartDataset[];
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  height?: string;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class Chart {
  readonly config = input.required<ChartConfig>();
  readonly size = input<ChartSize>('md');
  readonly loading = input<boolean>(false);

  // Simple chart rendering using SVG
  maxValue = computed(() => {
    const allData = this.config().datasets.flatMap((d) => d.data);
    return Math.max(...allData, 0);
  });

  minValue = computed(() => {
    const allData = this.config().datasets.flatMap((d) => d.data);
    return Math.min(...allData, 0);
  });

  chartHeight = computed(() => {
    switch (this.size()) {
      case 'sm':
        return '200';
      case 'lg':
        return '400';
      case 'xl':
        return '500';
      default:
        return '300';
    }
  });

  getHeightClass(): string {
    switch (this.size()) {
      case 'sm':
        return 'h-[200px]';
      case 'lg':
        return 'h-[400px]';
      case 'xl':
        return 'h-[500px]';
      default:
        return 'h-[300px]';
    }
  }

  getBarHeight(value: number): number {
    const max = this.maxValue();
    if (max === 0) return 0;
    return (value / max) * 100;
  }

  getLinePoints(data: number[]): string {
    const max = this.maxValue();
    const min = this.minValue();
    const range = max - min || 1;
    const width = 100;
    const height = 100;
    const step = width / (data.length - 1 || 1);

    return data
      .map((value, index) => {
        const x = index * step;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }

  getAreaPath(data: number[]): string {
    const points = this.getLinePoints(data);
    const pointsArray = points.split(' ');
    if (pointsArray.length === 0) return '';

    const firstPoint = pointsArray[0];
    const lastPoint = pointsArray[pointsArray.length - 1];
    const [lastX] = lastPoint.split(',');
    const [firstX] = firstPoint.split(',');

    return `M ${firstPoint} L ${points} L ${lastX},100 L ${firstX},100 Z`;
  }

  getPieSlices(): Array<{
    path: string;
    color: string;
    percentage: number;
    label: string;
  }> {
    const dataset = this.config().datasets[0];
    if (!dataset) return [];

    const total = dataset.data.reduce((sum, val) => sum + val, 0);
    let currentAngle = -90;
    const centerX = 50;
    const centerY = 50;
    const radius = 40;

    return dataset.data.map((value, index) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const endAngle = currentAngle + angle;

      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

      const colors = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor
        : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

      currentAngle = endAngle;

      return {
        path,
        color: colors[index % colors.length],
        percentage: Math.round(percentage),
        label: this.config().labels[index],
      };
    });
  }

  getDoughnutSlices(): Array<{
    path: string;
    color: string;
    percentage: number;
    label: string;
  }> {
    const dataset = this.config().datasets[0];
    if (!dataset) return [];

    const total = dataset.data.reduce((sum, val) => sum + val, 0);
    let currentAngle = -90;
    const centerX = 50;
    const centerY = 50;
    const outerRadius = 40;
    const innerRadius = 25;

    return dataset.data.map((value, index) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const endAngle = currentAngle + angle;

      const startRad = (currentAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1Outer = centerX + outerRadius * Math.cos(startRad);
      const y1Outer = centerY + outerRadius * Math.sin(startRad);
      const x2Outer = centerX + outerRadius * Math.cos(endRad);
      const y2Outer = centerY + outerRadius * Math.sin(endRad);

      const x1Inner = centerX + innerRadius * Math.cos(startRad);
      const y1Inner = centerY + innerRadius * Math.sin(startRad);
      const x2Inner = centerX + innerRadius * Math.cos(endRad);
      const y2Inner = centerY + innerRadius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `
        M ${x1Outer},${y1Outer}
        A ${outerRadius},${outerRadius} 0 ${largeArc},1 ${x2Outer},${y2Outer}
        L ${x2Inner},${y2Inner}
        A ${innerRadius},${innerRadius} 0 ${largeArc},0 ${x1Inner},${y1Inner}
        Z
      `;

      const colors = Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor
        : ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

      currentAngle = endAngle;

      return {
        path,
        color: colors[index % colors.length],
        percentage: Math.round(percentage),
        label: this.config().labels[index],
      };
    });
  }
}
