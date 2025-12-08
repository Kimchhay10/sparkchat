import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EmojiPickerComponent } from '../../emoji-picker/emoji-picker.component';
import { GifPickerComponent } from '../../gif-picker/gif-picker.component';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, EmojiPickerComponent, GifPickerComponent],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css',
})
export class ChatInputComponent {
  message = input.required<string>();
  previewGifUrl = input<string | null>(null);
  isLoggedIn = input.required<boolean>();

  messageChange = output<string>();
  emojiSelected = output<string>();
  gifSelected = output<string>();
  sendMessage = output<void>();
  removeGifPreview = output<void>();

  onMessageInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.messageChange.emit(value);
  }

  onEmojiSelected(emoji: string): void {
    this.emojiSelected.emit(emoji);
  }

  onGifSelected(gifUrl: string): void {
    this.gifSelected.emit(gifUrl);
  }

  onSendMessage(): void {
    this.sendMessage.emit();
  }

  onRemoveGifPreview(): void {
    this.removeGifPreview.emit();
  }
}

