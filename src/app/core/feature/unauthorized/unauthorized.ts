import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-unauthorized',
  imports: [CommonModule, TranslateModule, Button],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css',
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  goBack(): void {
    window.history.back();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
