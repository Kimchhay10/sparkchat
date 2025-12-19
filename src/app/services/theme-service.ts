import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<ThemeMode>(this.getThemeFromStorage());
  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Listen for system theme changes
      this.mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme() === 'system') {
          this.applyTheme('system');
        }
      });
    }

    // Apply theme on initialization and when it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  private getThemeFromStorage(): ThemeMode {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem('phenka_theme') as ThemeMode;
    return saved || 'system';
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    localStorage.setItem('phenka_theme', theme);
  }

  toggleTheme(): void {
    const themes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    const isDark = this.shouldUseDarkMode(theme);

    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  private shouldUseDarkMode(theme: ThemeMode): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // system
    return this.mediaQuery?.matches ?? false;
  }

  isDarkMode(): boolean {
    return this.shouldUseDarkMode(this.currentTheme());
  }

  getThemeIcon(): string {
    const theme = this.currentTheme();
    if (theme === 'light') return 'sun';
    if (theme === 'dark') return 'moon';
    return 'system';
  }

  getThemeLabel(): string {
    const theme = this.currentTheme();
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  }
}
