import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../../../services/lang-service';
import { ThemeService, ThemeMode } from '../../../../services/theme-service';
import { SidebarService } from '../../../../services/sidebar-service';
import { Dropdown, DropdownOption } from '../../../ui/dropdown/dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslateModule, Dropdown],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  readonly langService = inject(LangService);
  readonly themeService = inject(ThemeService);
  readonly sidebarService = inject(SidebarService);
  private readonly translate = inject(TranslateService);

  // Theme dropdown options with icons - reactive to language changes
  themeOptions = computed<DropdownOption[]>(() => {
    // Trigger recomputation when language changes
    const currentLang = this.langService.currentLang();

    return [
      {
        value: 'light',
        label: this.translate.instant('theme.light'),
        icon: `<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`,
      },
      {
        value: 'dark',
        label: this.translate.instant('theme.dark'),
        icon: `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>`,
      },
      {
        value: 'system',
        label: this.translate.instant('theme.system'),
        icon: `<svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>`,
      },
    ];
  });

  toggleLanguage(): void {
    this.langService.toggleLang();
  }

  onThemeChange(theme: string): void {
    this.themeService.setTheme(theme as ThemeMode);
  }
}
