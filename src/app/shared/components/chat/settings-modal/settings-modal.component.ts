import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ChatService } from '../../../../services/chat-service';
import { MusicService } from '../../../../services/music-service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css',
})
export class SettingsModalComponent {
  isOpen = input.required<boolean>();
  chatService = input.required<ChatService>();
  musicService = input.required<MusicService>();

  close = output<void>();
  toggleSound = output<void>();
  toggleNotifications = output<void>();
  toggleTheme = output<void>();
  toggleMusic = output<void>();
  musicVolumeChange = output<number>();

  onClose(): void {
    this.close.emit();
  }

  onToggleSound(): void {
    this.toggleSound.emit();
  }

  onToggleNotifications(): void {
    this.toggleNotifications.emit();
  }

  onToggleTheme(): void {
    this.toggleTheme.emit();
  }

  async onToggleMusic(): Promise<void> {
    // User interaction - good time to start audio context
    if (!this.getSettings().musicEnabled) {
      // Will be enabled after this call
      // The parent component will handle starting the music
    }
    this.toggleMusic.emit();
  }

  onMusicVolumeChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.musicVolumeChange.emit(value);
  }

  getSettings() {
    return this.chatService().getSettings();
  }

  getMusicVolume(): number {
    return this.musicService().getVolume();
  }

  getMusicVolumePercent(): number {
    return Math.round(this.getMusicVolume() * 100);
  }

  protected readonly Math = Math;
}

