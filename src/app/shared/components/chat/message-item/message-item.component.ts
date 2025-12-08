import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Message {
  id: number;
  username: string;
  message: string;
  roomId: string;
  emoji: string | null;
  messageType: string;
  createdAt: string;
}

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css',
})
export class MessageItemComponent {
  message = input.required<Message>();
  currentUsername = input.required<string>();

  // Computed properties for template compatibility
  isOwn = computed(() => this.message().username === this.currentUsername());

  isGif = computed(() => {
    const msg = this.message().message;
    if (!msg) return false;
    return (
      (msg.startsWith('https://') || msg.startsWith('http://')) &&
      (msg.includes('.gif') ||
        msg.includes('giphy.com') ||
        msg.includes('media.giphy.com'))
    );
  });

  timestamp = computed(() => {
    const createdAt = this.message().createdAt;
    return createdAt ? new Date(createdAt) : new Date();
  });

  avatar = computed(() => {
    const avatars = ['👩', '👨', '🧑', '👱‍♀️', '😎', '🤖', '👽', '🦄'];
    const username = this.message().username;
    const hash = username
      .split('')
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    return avatars[hash % avatars.length];
  });

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }
}
