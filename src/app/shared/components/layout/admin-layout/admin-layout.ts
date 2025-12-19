import { Component, signal, OnInit } from '@angular/core';
import { AppSidebarComponent } from '../sidebar/sidebar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  imports: [AppSidebarComponent, RouterModule, CommonModule, TranslateModule],
})
export class AdminLayout implements OnInit {
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    // Simulate page load animation
    setTimeout(() => {
      this.isLoading.set(false);
    }, 300);
  }
}
