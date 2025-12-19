import { Component, computed, input, output } from '@angular/core';

export type ButtonType =
  | 'primary'
  | 'outlined'
  | 'ghost'
  | 'secondary'
  | 'danger'
  | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  readonly variant = input<ButtonType>('primary');
  readonly size = input<ButtonSize>('md');
  readonly isLoading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(true);
  readonly icon = input<string>('');
  readonly iconPosition = input<'left' | 'right'>('left');

  readonly buttonClick = output<Event>();

  private readonly baseClasses =
    'inline-flex items-center justify-center gap-2 ' +
    'rounded-lg font-medium ' +
    'transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  readonly buttonClasses = computed(() => {
    let variant = '';
    switch (this.variant()) {
      case 'outlined':
        variant =
          'border-2 border-brand  text-brand  bg-transparent hover:bg-brand/20 dark:hover:bg-brand/20 focus:ring-brand ';
        break;

      case 'ghost':
        variant =
          'text-brand hover:text-white bg-transparent hover:bg-brand dark:hover:bg-brand/20 focus:ring-brand ';
        break;

      case 'secondary':
        variant =
          'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500';
        break;

      case 'danger':
        variant =
          'text-white bg-red-600 hover:bg-red-700 shadow-sm focus:ring-red-500';
        break;

      case 'success':
        variant =
          'text-white bg-brand hover:bg-brand-strong shadow-sm focus:ring-brand';
        break;

      default: // primary
        variant =
          'text-white bg-brand  hover:bg-brand  shadow-sm focus:ring-brand ';
    }

    let sizing = '';
    switch (this.size()) {
      case 'sm':
        sizing = 'px-3 py-1.5 text-sm';
        break;
      case 'lg':
        sizing = 'px-6 py-3 text-base';
        break;
      default: // md
        sizing = 'px-4 py-2.5 text-sm';
    }

    const width = this.fullWidth() ? 'w-full' : '';

    return `${this.baseClasses} ${variant} ${sizing} ${width}`;
  });

  onClick(event: Event): void {
    if (!this.disabled() && !this.isLoading()) {
      this.buttonClick.emit(event);
    }
  }
}
