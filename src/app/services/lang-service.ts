import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  protected readonly tranService = inject(TranslateService);
  lang = new BehaviorSubject('km'); // Default to Khmer
  lang$ = this.lang.asObservable();
  currentLang = signal<string>('km');

  constructor() {
    this.tranService.addLangs(['en', 'km']);
    
    // Load saved language or default to Khmer
    const savedLang = localStorage.getItem('sparkchat_lang') || 'km';
    this.tranService.use(savedLang);
    this.lang.next(savedLang);
    this.currentLang.set(savedLang);
  }

  toggleLang(lang?: string): void {
    const newLang = lang || (this.currentLang() === 'km' ? 'en' : 'km');
    this.tranService.use(newLang);
    this.lang.next(newLang);
    this.currentLang.set(newLang);
    localStorage.setItem('sparkchat_lang', newLang);
  }

  getCurrentLang(): string {
    return this.currentLang();
  }

  isKhmer(): boolean {
    return this.currentLang() === 'km';
  }
}
