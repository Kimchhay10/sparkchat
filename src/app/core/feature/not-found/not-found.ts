import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, TranslateModule, Button],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goBack(): void {
    window.history.back();
  }
}
