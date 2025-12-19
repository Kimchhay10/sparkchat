import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastData, ToastPosition } from './toast';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, Toast],
  template: `
    <div
      class="fixed z-[9999] flex flex-col gap-3 pointer-events-none"
      [ngClass]="positionClasses()"
    >
      @for (toast of toasts(); track toast.id) {
      <div class="pointer-events-auto">
        <app-toast [toast]="toast" (close)="onToastClose($event)" />
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ToastContainer {
  readonly toasts = input.required<ToastData[]>();
  readonly position = input<ToastPosition>('top-right');
  readonly onClose = input.required<(id: string) => void>();

  readonly positionClasses = computed(() => {
    const pos = this.position();
    const baseClasses = 'p-4 ';

    switch (pos) {
      case 'top-right':
        return baseClasses + 'top-0 right-0';
      case 'top-left':
        return baseClasses + 'top-0 left-0';
      case 'bottom-right':
        return baseClasses + 'bottom-0 right-0';
      case 'bottom-left':
        return baseClasses + 'bottom-0 left-0';
      case 'top-center':
        return baseClasses + 'top-0 left-1/2 -translate-x-1/2';
      case 'bottom-center':
        return baseClasses + 'bottom-0 left-1/2 -translate-x-1/2';
      default:
        return baseClasses + 'top-0 right-0';
    }
  });

  onToastClose(id: string): void {
    this.onClose()(id);
  }
}
