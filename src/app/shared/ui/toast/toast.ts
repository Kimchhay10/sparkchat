import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastData {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  duration?: number;
  dismissible?: boolean;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast-item flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out"
      [ngClass]="toastClasses()"
      role="alert"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5" [ngClass]="iconColorClass()">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          @switch (toast().variant) { @case ('success') {
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
          } @case ('error') {
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
          } @case ('warning') {
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
          } @case ('info') {
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
          } }
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-sm" [ngClass]="titleColorClass()">
          {{ toast().title }}
        </p>
        @if (toast().message) {
        <p class="text-sm mt-1 text-gray-600 dark:text-gray-400">
          {{ toast().message }}
        </p>
        }
      </div>

      <!-- Close Button -->
      @if (toast().dismissible !== false) {
      <button
        type="button"
        (click)="onClose()"
        class="flex-shrink-0 inline-flex rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        [attr.aria-label]="'Close'"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
      }
    </div>
  `,
  styles: [
    `
      .toast-item {
        min-width: 320px;
        max-width: 420px;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .toast-item.removing {
        animation: slideOut 0.3s ease-in forwards;
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `,
  ],
})
export class Toast {
  readonly toast = input.required<ToastData>();
  readonly close = output<string>();

  readonly toastClasses = computed(() => {
    const variant = this.toast().variant;
    const baseClasses = 'border ';

    switch (variant) {
      case 'success':
        return (
          baseClasses +
          'bg-brand/5 dark:bg-brand/10 border-brand/30 dark:border-brand/40'
        );
      case 'error':
        return (
          baseClasses +
          'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'
        );
      case 'warning':
        return (
          baseClasses +
          'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50'
        );
      case 'info':
        return (
          baseClasses +
          'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50'
        );
      default:
        return (
          baseClasses +
          'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        );
    }
  });

  readonly iconColorClass = computed(() => {
    const variant = this.toast().variant;
    switch (variant) {
      case 'success':
        return 'text-brand';
      case 'error':
        return 'text-red-600 dark:text-red-500';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-500';
      case 'info':
        return 'text-blue-600 dark:text-blue-500';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  });

  readonly titleColorClass = computed(() => {
    const variant = this.toast().variant;
    switch (variant) {
      case 'success':
        return 'text-brand-strong dark:text-brand';
      case 'error':
        return 'text-red-900 dark:text-red-400';
      case 'warning':
        return 'text-yellow-900 dark:text-yellow-400';
      case 'info':
        return 'text-blue-900 dark:text-blue-400';
      default:
        return 'text-gray-900 dark:text-gray-100';
    }
  });

  onClose(): void {
    this.close.emit(this.toast().id);
  }
}
