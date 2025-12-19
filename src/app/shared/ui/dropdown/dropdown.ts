import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown {
  // Inputs
  options = input.required<DropdownOption[]>();
  selectedValue = input<string>('');
  placeholder = input<string>('Select option');
  disabled = input<boolean>(false);
  position = input<'left' | 'right'>('right');
  size = input<'sm' | 'md' | 'lg'>('md');
  fullWidth = input<boolean>(false);

  // Outputs
  valueChange = output<string>();

  // State
  isOpen = signal<boolean>(false);
  selectedOption = signal<DropdownOption | null>(null);

  constructor() {
    // Update selected option when selectedValue changes
    effect(() => {
      const value = this.selectedValue();
      const option = this.options().find((opt) => opt.value === value);
      this.selectedOption.set(option || null);
    });
  }

  toggle(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  selectOption(option: DropdownOption): void {
    this.selectedOption.set(option);
    this.valueChange.emit(option.value);
    this.close();
  }

  getSizeClasses(): string {
    const sizes = {
      sm: 'h-8 text-xs px-2',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4',
    };
    return sizes[this.size()];
  }

  getDropdownSizeClasses(): string {
    const sizes = {
      sm: 'py-1 text-xs min-w-[120px]',
      md: 'py-1.5 text-sm min-w-[160px]',
      lg: 'py-2 text-base min-w-[200px]',
    };
    return sizes[this.size()];
  }

  getPositionClasses(): string {
    return this.position() === 'left' ? 'left-0' : 'right-0';
  }
}
