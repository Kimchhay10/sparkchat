import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  protected readonly tranService = inject(TranslateService);
  lang = new BehaviorSubject('en');
  lang$ = this.lang.asObservable();

  constructor() {
    this.tranService.addLangs(['en', 'km']);
    this.tranService.use('en');
  }

  toggleLang(lang: string) {
    this.tranService.use(lang);
    this.lang.next(lang);
  }
}
