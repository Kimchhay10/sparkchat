import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../../shared/ui/button/button';
import { LangService } from '../../../services/lang-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, TranslateModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class LandingComponent {
  private readonly langService = inject(LangService);

  readonly currentLang = computed(() => this.langService.getCurrentLang());
  readonly isKhmer = computed(() => this.langService.isKhmer());

  switchToKhmer(): void {
    if (!this.langService.isKhmer()) {
      this.langService.toggleLang('km');
    }
  }

  switchToEnglish(): void {
    if (this.langService.isKhmer()) {
      this.langService.toggleLang('en');
    }
  }
}
