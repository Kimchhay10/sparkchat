import { Component, inject } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/ui/dropdown/dropdown.component';
import { LangService } from '../../../services/lang-service';
import { TranslatePipe } from '@ngx-translate/core';
import clsx from 'clsx';
@Component({
  selector: 'app-home-page',
  imports: [DropdownComponent, TranslatePipe],
  templateUrl: './home-page.html',
  standalone: true,
})
export class HomePageComponent {
  protected readonly langService = inject(LangService);
  protected readonly clsx = clsx;
  ngOnInit(): void {}
  dropdownItems = [
    {
      name: 'ភាសាខ្មែរ',
      value: 'km',
      onClick: (lang: string) => {
        this.onToggleLang('km');
      },
    },
    {
      name: 'English',
      value: 'en',
      onClick: (lang: string) => {
        this.onToggleLang('en');
      },
    },
  ];

  onToggleLang(lang: string) {
    this.langService.toggleLang(lang);
  }
}
