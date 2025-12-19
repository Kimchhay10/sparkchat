import { Component, input, output } from '@angular/core';

export type CardVariant = 'default' | 'bordered' | 'elevated' | 'ghost';
export type CardSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  readonly variant = input<CardVariant>('default');
  readonly size = input<CardSize>('md');
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
  readonly iconColor = input<string>('text-blue-600');
  readonly headerAction = input<boolean>(false);
  readonly hoverable = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly cardClick = output<void>();

  getCardClasses(): string {
    const base = 'rounded-lg transition-all duration-200';
    const hover = this.hoverable() ? 'hover:shadow-lg cursor-pointer' : '';

    let variant = '';
    switch (this.variant()) {
      case 'bordered':
        variant =
          'border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900';
        break;
      case 'elevated':
        variant = 'shadow-lg bg-white dark:bg-gray-900';
        break;
      case 'ghost':
        variant = 'bg-transparent';
        break;
      default:
        variant =
          'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm';
    }

    let size = '';
    switch (this.size()) {
      case 'sm':
        size = 'p-3';
        break;
      case 'lg':
        size = 'p-6';
        break;
      default:
        size = 'p-4';
    }

    return `${base} ${variant} ${size} ${hover}`;
  }

  onClick(): void {
    if (this.hoverable()) {
      this.cardClick.emit();
    }
  }
}
