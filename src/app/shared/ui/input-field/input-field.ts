import { Component, forwardRef, input, computed } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'bordered' | 'filled' | 'ghost';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputField),
      multi: true,
    },
  ],
})
export class InputField implements ControlValueAccessor {
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly isError = input<boolean>(false);
  readonly label = input<string>('');
  readonly hint = input<string>('');
  readonly icon = input<string>('');
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly size = input<InputSize>('md');
  readonly variant = input<InputVariant>('default');
  readonly errorMessage = input<string>('');

  value = '';
  disabled = false;

  readonly inputClasses = computed(() => {
    const base =
      'w-full rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';

    let variant = '';
    switch (this.variant()) {
      case 'bordered':
        variant = 'border-2 bg-transparent';
        break;
      case 'filled':
        variant = 'border-0 bg-gray-100 dark:bg-gray-800';
        break;
      case 'ghost':
        variant =
          'border-0 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800';
        break;
      default:
        variant = 'border bg-white dark:bg-gray-900';
    }

    let sizing = '';
    switch (this.size()) {
      case 'sm':
        sizing = 'text-sm py-1.5 px-3';
        break;
      case 'lg':
        sizing = 'text-lg py-3 px-4';
        break;
      default:
        sizing = 'text-base py-2.5 px-3';
    }

    const error = this.isError()
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500';

    const icon = this.icon() && this.iconPosition() === 'left' ? 'pl-10' : '';
    const iconRight =
      this.icon() && this.iconPosition() === 'right' ? 'pr-10' : '';

    return `${base} ${variant} ${sizing} ${error} ${icon} ${iconRight} text-gray-900 dark:text-gray-100 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`;
  });

  // -------------------------
  // CVA callbacks
  // -------------------------
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // -------------------------
  // CVA methods
  // -------------------------
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // -------------------------
  // Events
  // -------------------------
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
