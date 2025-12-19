import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-server-error',
  imports: [CommonModule, TranslateModule, Button],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerErrorComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  refresh(): void {
    window.location.reload();
  }
}
