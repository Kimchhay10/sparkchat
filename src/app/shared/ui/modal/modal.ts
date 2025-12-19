import { Component, input, output, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Button } from '../button/button';

@Component({
  selector: 'app-modal',
  imports: [Button],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  readonly isOpen = input<boolean>(false);
  readonly close = output();
  readonly open = output();
  readonly confirm = output();
  readonly cancelText = input();
  readonly title = input();
  readonly confirmText = input();
  private readonly subscription: Subscription | null = null;
  onOpen(): void {
    this.open.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  ngOnDestroy() {
    this.subscription!.unsubscribe();
    this.onClose();
  }
}
