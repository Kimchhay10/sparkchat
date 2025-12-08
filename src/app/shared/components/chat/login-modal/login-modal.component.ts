import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css',
})
export class LoginModalComponent {
  isOpen = input.required<boolean>();
  username = input.required<string>();
  
  usernameChange = output<string>();
  login = output<void>();
  generateRandom = output<void>();
  close = output<void>();

  onUsernameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.usernameChange.emit(value);
  }

  onLogin(): void {
    this.login.emit();
  }

  onGenerateRandom(): void {
    this.generateRandom.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

