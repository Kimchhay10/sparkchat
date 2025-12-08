import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface SearchResult {
  messageId: string;
  text: string;
  sender: string;
  timestamp: Date;
}

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './search-modal.component.html',
  styleUrl: './search-modal.component.css',
})
export class SearchModalComponent {
  isOpen = input.required<boolean>();
  searchQuery = input.required<string>();
  searchResults = input.required<SearchResult[]>();

  searchQueryChange = output<string>();
  navigateToMessage = output<string>();
  close = output<void>();

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQueryChange.emit(value);
  }

  onNavigate(messageId: string): void {
    this.navigateToMessage.emit(messageId);
  }

  onClose(): void {
    this.close.emit();
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }
}

