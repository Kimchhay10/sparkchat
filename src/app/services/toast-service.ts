import { Injectable, signal, computed } from '@angular/core';
import {
  ToastData,
  ToastVariant,
  ToastPosition,
} from '../shared/ui/toast/toast';

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSignal = signal<ToastData[]>([]);
  private readonly positionSignal = signal<ToastPosition>('top-right');

  readonly toasts = computed(() => this.toastsSignal());
  readonly position = computed(() => this.positionSignal());

  private toastCounter = 0;

  /**
   * Set the global position for all toasts
   */
  setPosition(position: ToastPosition): void {
    this.positionSignal.set(position);
  }

  /**
   * Show a success toast
   */
  success(title: string, message?: string, duration: number = 5000): void {
    this.show(
      {
        title,
        message,
        duration,
      },
      'success'
    );
  }

  /**
   * Show an error toast
   */
  error(title: string, message?: string, duration: number = 5000): void {
    this.show(
      {
        title,
        message,
        duration,
      },
      'error'
    );
  }

  /**
   * Show a warning toast
   */
  warning(title: string, message?: string, duration: number = 5000): void {
    this.show(
      {
        title,
        message,
        duration,
      },
      'warning'
    );
  }

  /**
   * Show an info toast
   */
  info(title: string, message?: string, duration: number = 5000): void {
    this.show(
      {
        title,
        message,
        duration,
      },
      'info'
    );
  }

  /**
   * Show a custom toast with full control
   */
  show(options: ToastOptions, variant: ToastVariant = 'info'): void {
    const id = `toast-${++this.toastCounter}-${Date.now()}`;
    const duration = options.duration ?? 5000;

    const toast: ToastData = {
      id,
      title: options.title,
      message: options.message,
      variant,
      duration,
      dismissible: options.dismissible !== false,
    };

    this.toastsSignal.update((toasts) => [...toasts, toast]);

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  /**
   * Dismiss a specific toast by ID
   */
  dismiss(id: string): void {
    this.toastsSignal.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toastsSignal.set([]);
  }

  /**
   * Get current number of active toasts
   */
  get count(): number {
    return this.toastsSignal().length;
  }
}
