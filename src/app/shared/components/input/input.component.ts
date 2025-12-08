import { Component, input, output, signal, effect, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  error = input<string>('');
  icon = input<string>('');
  variant = input<'default' | 'glow' | 'gradient'>('default');

  // Outputs
  valueChange = output<string>();
  focusChange = output<boolean>();

  // Internal state
  value = signal<string>('');
  isFocused = signal<boolean>(false);
  isFilled = signal<boolean>(false);

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    effect(() => {
      this.isFilled.set(this.value().length > 0);
    });
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
    this.valueChange.emit(target.value);
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focusChange.emit(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
    this.focusChange.emit(false);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}

