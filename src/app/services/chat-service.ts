import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ChatSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  musicEnabled: boolean;
  musicVolume: number;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  autoScroll: boolean;
}

export interface SearchResult {
  messageId: string;
  text: string;
  sender: string;
  timestamp: Date;
  matchIndex: number;
}

// API DTOs matching the Spring Boot backend
export interface ChatMessageRequest {
  username: string; // @NotBlank, @Size(min = 1, max = 50)
  message: string; // @NotBlank, @Size(min = 1, max = 500)
  roomId?: string; // @Size(max = 50)
  emoji?: string; // @Size(max = 20)
  messageType?: string; // @Size(max = 20)
}

// ChatMessageResponse matching the actual backend response
export interface ChatMessageResponse {
  id: number;
  username: string;
  message: string;
  roomId: string;
  emoji: string | null;
  messageType: string;
  createdAt: string; // ISO 8601 format
}

export interface ChatPageResponse {
  messages: ChatMessageResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://sparkchat-api.onrender.com/api/chat';

  private settings = signal<ChatSettings>({
    soundEnabled: true,
    notificationsEnabled: true,
    musicEnabled: false,
    musicVolume: 0.3,
    theme: 'dark',
    fontSize: 'medium',
    autoScroll: true,
  });

  private searchQuery = signal<string>('');
  private searchResults = signal<SearchResult[]>([]);

  constructor() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('sparkchat_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Ensure theme defaults to 'dark' if not set
        if (!parsed.theme) {
          parsed.theme = 'dark';
        }
        this.settings.set(parsed);
      } catch (e) {
        console.error('Error loading settings:', e);
        // Reset to defaults if parsing fails
        this.settings.set({
          soundEnabled: true,
          notificationsEnabled: true,
          musicEnabled: false,
          musicVolume: 0.3,
          theme: 'dark',
          fontSize: 'medium',
          autoScroll: true,
        });
      }
    } else {
      // No saved settings - use defaults with dark theme
      this.settings.set({
        soundEnabled: true,
        notificationsEnabled: true,
        musicEnabled: false,
        musicVolume: 0.3,
        theme: 'dark',
        fontSize: 'medium',
        autoScroll: true,
      });
    }
  }

  // Settings Management
  getSettings(): ChatSettings {
    return this.settings();
  }

  updateSettings(updates: Partial<ChatSettings>): void {
    this.settings.update((current) => {
      const updated = { ...current, ...updates };
      localStorage.setItem('sparkchat_settings', JSON.stringify(updated));
      return updated;
    });
  }

  toggleSound(): void {
    this.updateSettings({ soundEnabled: !this.settings().soundEnabled });
  }

  toggleNotifications(): void {
    this.updateSettings({
      notificationsEnabled: !this.settings().notificationsEnabled,
    });
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.updateSettings({ theme });
  }

  setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.updateSettings({ fontSize: size });
  }

  toggleAutoScroll(): void {
    this.updateSettings({ autoScroll: !this.settings().autoScroll });
  }

  toggleMusic(): void {
    this.updateSettings({ musicEnabled: !this.settings().musicEnabled });
  }

  setMusicVolume(volume: number): void {
    this.updateSettings({ musicVolume: Math.max(0, Math.min(1, volume)) });
  }

  // Search Management
  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getSearchQuery(): string {
    return this.searchQuery();
  }

  setSearchResults(results: SearchResult[]): void {
    this.searchResults.set(results);
  }

  getSearchResults(): SearchResult[] {
    return this.searchResults();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

  // Search messages
  searchMessages(messages: any[], query: string): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    messages.forEach((message) => {
      const text = message.message?.toLowerCase() || '';
      const index = text.indexOf(lowerQuery);

      if (index !== -1) {
        results.push({
          messageId: message.id.toString(),
          text: message.message,
          sender: message.username,
          timestamp: message.createdAt
            ? new Date(message.createdAt)
            : new Date(),
          matchIndex: index,
        });
      }
    });

    return results;
  }

  // API Methods
  sendMessage(request: ChatMessageRequest): Observable<ChatMessageResponse> {
    return this.http.post<ChatMessageResponse>(
      `${this.API_URL}/messages`,
      request
    );
  }

  getMessages(
    roomId?: string,
    page: number = 0,
    size: number = 50
  ): Observable<ChatPageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (roomId) {
      params = params.set('roomId', roomId);
    }

    return this.http.get<ChatPageResponse>(`${this.API_URL}/messages`, {
      params,
    });
  }

  getRecentMessages(
    roomId?: string,
    minutes: number = 5
  ): Observable<ChatMessageResponse[]> {
    let params = new HttpParams().set('minutes', minutes.toString());

    if (roomId) {
      params = params.set('roomId', roomId);
    }

    return this.http.get<ChatMessageResponse[]>(
      `${this.API_URL}/messages/recent`,
      { params }
    );
  }

  getMessageCount(roomId?: string): Observable<number> {
    let params = new HttpParams();

    if (roomId) {
      params = params.set('roomId', roomId);
    }

    return this.http.get<number>(`${this.API_URL}/messages/count`, { params });
  }

  cleanupOldMessages(
    roomId?: string,
    daysToKeep: number = 7
  ): Observable<void> {
    let params = new HttpParams().set('daysToKeep', daysToKeep.toString());

    if (roomId) {
      params = params.set('roomId', roomId);
    }

    return this.http.delete<void>(`${this.API_URL}/messages/cleanup`, {
      params,
    });
  }

  healthCheck(): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/health`, {
      responseType: 'text' as 'json',
    });
  }
}
