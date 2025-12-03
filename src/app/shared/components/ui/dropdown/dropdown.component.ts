import { Component, input, signal } from '@angular/core';
import clsx from 'clsx';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  readonly dropdownItems = input<any[]>();
  isOpen = signal<boolean>(false);
  protected readonly clsx = clsx;

  onToggle(): void {
    this.isOpen.set(!this.isOpen());
    console.log('===toggle');
  }

  onClickBackdrop(): void {
    this.isOpen.set(false);
  }
}
