import {
  Component,
  signal,
  effect,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ChatService,
  ChatMessageResponse,
} from '../../../services/chat-service';
import { LangService } from '../../../services/lang-service';
import { SoundService } from '../../../services/sound-service';
import { MusicService } from '../../../services/music-service';
import { LoginModalComponent } from './login-modal/login-modal.component';
import {
  SearchModalComponent,
  SearchResult,
} from './search-modal/search-modal.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import {
  MessageItemComponent,
  Message,
} from './message-item/message-item.component';
import { ChatInputComponent } from './chat-input/chat-input.component';

// Message interface is now imported from message-item component

interface User {
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  typing?: boolean;
}

interface QuickNote {
  id: string;
  text: string;
  timestamp: Date;
  color: string;
}

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    LoginModalComponent,
    SearchModalComponent,
    SettingsModalComponent,
    MessageItemComponent,
    ChatInputComponent,
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatRoomComponent implements OnInit {
  protected chatService = inject(ChatService);
  protected musicService = inject(MusicService);
  private langService = inject(LangService);
  private translateService = inject(TranslateService);
  private soundService = inject(SoundService);
  messages = signal<Message[]>([]);
  searchResults = signal<SearchResult[]>([]);
  newMessage = signal<string>('');
  previewGifUrl = signal<string | null>(null);
  currentUser = signal<string>('You');
  currentRoomId = signal<string | undefined>(undefined);
  onlineUsers = signal<User[]>([
    { name: 'Alice', avatar: '👩', status: 'online' },
    { name: 'Bob', avatar: '👨', status: 'online', typing: false },
    { name: 'Charlie', avatar: '🧑', status: 'away' },
    { name: 'Diana', avatar: '👱‍♀️', status: 'online' },
  ]);

  // Pagination
  currentPage = signal<number>(0);
  pageSize = 50;
  hasMoreMessages = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  private refreshInterval?: ReturnType<typeof setInterval>;

  // UI States
  showSearch = signal<boolean>(false);
  showCommandPalette = signal<boolean>(false);
  showQuickActions = signal<boolean>(false);
  showNotes = signal<boolean>(false);
  showSettings = signal<boolean>(false);
  searchQuery = signal<string>('');
  editingMessageId = signal<string | null>(null);
  replyingToId = signal<string | null>(null);
  selectedMessageId = signal<string | null>(null);

  // Productivity Features
  quickNotes = signal<QuickNote[]>([]);
  reminders = signal<Array<{ id: string; text: string; time: Date }>>([]);
  pinnedMessages = signal<Message[]>([]);

  // Language
  currentLang = signal<string>('km');

  // Guest Login - Username Handling
  showLoginModal = signal<boolean>(true);
  guestUsername = signal<string>('');
  isLoggedIn = signal<boolean>(false);

  constructor() {
    // Initialize language
    this.currentLang.set(this.langService.getCurrentLang());

    // Check if user is already logged in
    const savedUsername = localStorage.getItem('sparkchat_username');
    if (savedUsername) {
      this.guestUsername.set(savedUsername);
      this.currentUser.set(savedUsername);
      this.isLoggedIn.set(true);
      this.showLoginModal.set(false);
    }

    // Load settings from service
    const settings = this.chatService.getSettings();

    // Ensure dark theme is applied by default
    if (settings.theme === 'dark') {
      document.body.classList.add('dark');
    }

    // Initialize music service with settings
    this.musicService.setEnabled(settings.musicEnabled);
    this.musicService.setVolume(settings.musicVolume);

    // Music will start when user interacts (clicks, types, etc.)
    // This is required by browser autoplay policies

    // Initialize search query from service
    this.searchQuery.set(this.chatService.getSearchQuery());

    // Initialize quick notes
    this.quickNotes.set([
      {
        id: '1',
        text: 'Remember to finish the project',
        timestamp: new Date(),
        color: 'purple',
      },
      {
        id: '2',
        text: 'Call mom tomorrow',
        timestamp: new Date(),
        color: 'pink',
      },
    ]);
  }

  ngOnInit(): void {
    // Load messages from API when component initializes (only if logged in)
    if (this.isLoggedIn()) {
      this.loadMessages();
      this.startMessageRefresh();
    }
  }

  private startMessageRefresh(): void {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Set up periodic refresh for recent messages (every 5 seconds)
    this.refreshInterval = setInterval(() => {
      if (this.isLoggedIn()) {
        this.loadRecentMessages();
      } else {
        this.stopMessageRefresh();
      }
    }, 5000);
  }

  private stopMessageRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
  }

  loadMessages(page: number = 0): void {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    this.chatService
      .getMessages(this.currentRoomId(), page, this.pageSize)
      .subscribe({
        next: (response) => {
          const newMessages = response.messages.map((msg) =>
            this.convertApiMessageToMessage(msg)
          );

          if (page === 0) {
            this.messages.set(newMessages);
          } else {
            this.messages.update((msgs) => [...newMessages, ...msgs]);
          }

          this.currentPage.set(page);
          this.hasMoreMessages.set(!response.hasNext);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.isLoading.set(false);
        },
      });
  }

  loadRecentMessages(): void {
    this.chatService.getRecentMessages(this.currentRoomId(), 5).subscribe({
      next: (apiMessages) => {
        const recentMessages = apiMessages.map((msg) =>
          this.convertApiMessageToMessage(msg)
        );
        const currentMessageIds = new Set(this.messages().map((m) => m.id));

        // Add only new messages that aren't already in the list
        const newMessages = recentMessages.filter(
          (msg) => !currentMessageIds.has(msg.id)
        );

        if (newMessages.length > 0) {
          this.messages.update((msgs) => [...msgs, ...newMessages]);

          // Play sound for new messages
          const settings = this.chatService.getSettings();
          if (settings.soundEnabled) {
            this.soundService.playSound('receive');
          }
        }
      },
      error: (error) => {
        console.error('Error loading recent messages:', error);
      },
    });
  }

  convertApiMessageToMessage(apiMessage: ChatMessageResponse): Message {
    return {
      id: apiMessage.id,
      username: apiMessage.username,
      message: apiMessage.message,
      roomId: apiMessage.roomId,
      emoji: apiMessage.emoji,
      messageType: apiMessage.messageType,
      createdAt: apiMessage.createdAt,
    };
  }

  getAvatarForUser(username: string): string {
    // Simple avatar assignment based on username
    const avatars = ['👩', '👨', '🧑', '👱‍♀️', '😎', '🤖', '👽', '🦄'];
    // const hash = username
    //   .split('')
    //   .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    return avatars[1];
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    // Command Palette: Cmd/Ctrl + K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.showCommandPalette.update((show) => !show);
    }

    // Search: Cmd/Ctrl + F
    if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
      event.preventDefault();
      this.showSearch.update((show) => !show);
    }

    // Escape to close modals
    if (event.key === 'Escape') {
      this.showSearch.set(false);
      this.showCommandPalette.set(false);
      this.showQuickActions.set(false);
      this.showNotes.set(false);
      this.showSettings.set(false);
      this.selectedMessageId.set(null);
      this.editingMessageId.set(null);
      this.replyingToId.set(null);
    }
  }

  sendMessage(): void {
    // Start music if enabled (user interaction required)
    const settings = this.chatService.getSettings();
    if (settings.musicEnabled && !this.musicService.isMusicPlaying()) {
      this.musicService.playMusic();
    }

    // Allow sending if there's a message or a GIF preview
    if (this.newMessage().trim() || this.previewGifUrl()) {
      const messageText = this.previewGifUrl() || this.newMessage();
      const isGif = this.isGifUrl(messageText);

      // Create optimistic message for immediate UI update
      const optimisticMessage: Message = {
        id: Date.now(),
        username: this.currentUser(),
        message: messageText,
        roomId: this.currentRoomId() || '',
        emoji: null,
        messageType: isGif ? 'gif' : 'text',
        createdAt: new Date().toISOString(),
      };

      // Add optimistic message immediately
      this.messages.update((msgs) => [...msgs, optimisticMessage]);

      // Clear input
      const textToSend = messageText;
      this.newMessage.set('');
      this.previewGifUrl.set(null);
      const replyToId = this.replyingToId();
      this.replyingToId.set(null);

      // Play send sound
      if (settings.soundEnabled) {
        this.soundService.playSound('send');
      }

      // Send to API
      const request = {
        username: this.currentUser(),
        message: textToSend,
        roomId: this.currentRoomId(),
        messageType: isGif ? 'gif' : 'text',
      };

      this.chatService.sendMessage(request).subscribe({
        next: (response) => {
          // Replace optimistic message with real one from API
          const realMessage = this.convertApiMessageToMessage(response);
          this.messages.update((msgs) =>
            msgs.map((msg) =>
              msg.id === optimisticMessage.id ? realMessage : msg
            )
          );
        },
        error: (error) => {
          console.error('Error sending message:', error);
          // Remove optimistic message on error
          this.messages.update((msgs) =>
            msgs.filter((msg) => msg.id !== optimisticMessage.id)
          );
          // Optionally show error notification to user
        },
      });
    }
  }

  setTyping(username: string, typing: boolean): void {
    this.onlineUsers.update((users) =>
      users.map((u) => (u.name === username ? { ...u, typing } : u))
    );
  }

  editMessage(messageId: string): void {
    const message = this.messages().find((m) => m.id === parseInt(messageId));
    if (message && message.username === this.currentUser()) {
      this.editingMessageId.set(messageId);
      this.newMessage.set(message.message);
      this.selectedMessageId.set(null);
    }
  }

  saveEdit(messageId: string): void {
    if (this.newMessage().trim()) {
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === parseInt(messageId)
            ? {
                ...m,
                message: this.newMessage(),
                createdAt: new Date().toISOString(),
              }
            : m
        )
      );
      this.newMessage.set('');
      this.editingMessageId.set(null);
    }
  }

  deleteMessage(messageId: string): void {
    this.messages.update((msgs) =>
      msgs.filter((m) => m.id !== parseInt(messageId))
    );
    this.selectedMessageId.set(null);
  }

  addReaction(messageId: string, emoji: string): void {
    this.messages.update((msgs) =>
      msgs.map((m) => {
        if (m.id === parseInt(messageId)) {
          return {
            ...m,
            emoji: m.emoji === emoji ? null : emoji,
            createdAt: new Date().toISOString(),
          };
        }
        return m;
      })
    );
    this.selectedMessageId.set(null);
  }

  pinMessage(messageId: string): void {
    const message = this.messages().find((m) => m.id === parseInt(messageId));
    if (message) {
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === parseInt(messageId)
            ? { ...m, createdAt: new Date().toISOString() }
            : m
        )
      );
      this.pinnedMessages.update((pinned) =>
        pinned.filter((m) => m.id !== parseInt(messageId))
      );
      this.selectedMessageId.set(null);
    }
  }

  copyMessage(text: string): void {
    navigator.clipboard.writeText(text);
    this.selectedMessageId.set(null);
    // Show toast notification
  }

  replyToMessage(messageId: string): void {
    this.replyingToId.set(messageId);
    this.selectedMessageId.set(null);
  }

  addQuickNote(): void {
    const note: QuickNote = {
      id: Date.now().toString(),
      text: 'New note...',
      timestamp: new Date(),
      color: ['purple', 'pink', 'blue', 'green'][
        Math.floor(Math.random() * 4)
      ] as string,
    };
    this.quickNotes.update((notes) => [...notes, note]);
  }

  deleteNote(noteId: string): void {
    this.quickNotes.update((notes) => notes.filter((n) => n.id !== noteId));
  }

  getFilteredMessages(): Message[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.messages();
    return this.messages().filter((m) =>
      m.message.toLowerCase().includes(query)
    );
  }

  getTypingUsers(): User[] {
    return this.onlineUsers().filter((u) => u.typing);
  }

  onEmojiSelected(emoji: string): void {
    if (this.selectedMessageId()) {
      this.addReaction(this.selectedMessageId()!, emoji);
    } else {
      this.newMessage.update((msg) => msg + emoji);
    }
  }

  onGifSelected(gifUrl: string): void {
    this.newMessage.set(gifUrl);
    this.previewGifUrl.set(gifUrl);
  }

  isGifUrl(text: string): boolean {
    if (!text) return false;
    return (
      (text.startsWith('https://') || text.startsWith('http://')) &&
      (text.includes('.gif') ||
        text.includes('giphy.com') ||
        text.includes('media.giphy.com'))
    );
  }

  onMessageInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.newMessage.set(value);

    // Check if input contains a GIF URL
    if (this.isGifUrl(value)) {
      this.previewGifUrl.set(value);
    } else {
      this.previewGifUrl.set(null);
    }
  }

  removeGifPreview(): void {
    this.previewGifUrl.set(null);
    this.newMessage.set('');
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  formatFullTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  // Sound playing is now handled by SoundService

  executeCommand(command: string): void {
    switch (command) {
      case 'search':
        this.showSearch.set(true);
        break;
      case 'notes':
        this.showNotes.update((show) => !show);
        break;
      case 'settings':
        this.showSettings.update((show) => !show);
        break;
      case 'clear':
        this.messages.set([]);
        break;
    }
    this.showCommandPalette.set(false);
  }

  // Username Handling Methods
  loginAsGuest(): void {
    const username = this.guestUsername().trim();
    if (username) {
      this.currentUser.set(username);
      this.isLoggedIn.set(true);
      this.showLoginModal.set(false);
      // Save to localStorage
      localStorage.setItem('sparkchat_username', username);
      // Load messages after login
      this.loadMessages();
      // Start message refresh
      this.startMessageRefresh();
    }
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.showLoginModal.set(true);
    this.currentUser.set('You');
    this.guestUsername.set('');
    localStorage.removeItem('sparkchat_username');
    // Stop message refresh on logout
    this.stopMessageRefresh();
    // Clear messages
    this.messages.set([]);
  }

  generateRandomUsername(): void {
    const adjectives = [
      'Cool',
      'Epic',
      'Awesome',
      'Rad',
      'Lit',
      'Fire',
      'Chill',
      'Vibe',
      'Zen',
      'Wave',
    ];
    const nouns = [
      'Dude',
      'Buddy',
      'Pal',
      'Friend',
      'Star',
      'Hero',
      'Legend',
      'Boss',
      'Champ',
      'Pro',
    ];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    this.guestUsername.set(`${randomAdj}${randomNoun}${randomNum}`);
  }

  toggleSearch(): void {
    this.showSearch.update((v) => !v);
    if (!this.showSearch()) {
      this.chatService.clearSearch();
      this.searchQuery.set('');
      this.searchResults.set([]);
    }
  }

  toggleSettings(): void {
    this.showSettings.update((v) => !v);
  }

  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    this.chatService.setSearchQuery(query);

    if (query.trim()) {
      const results = this.chatService.searchMessages(this.messages(), query);
      this.searchResults.set(results);
      this.chatService.setSearchResults(results);
    } else {
      this.searchResults.set([]);
      this.chatService.clearSearch();
    }
  }

  // Component event handlers
  onLoginModalLogin(): void {
    this.loginAsGuest();
  }

  onLoginModalGenerateRandom(): void {
    this.generateRandomUsername();
  }

  onLoginModalUsernameChange(username: string): void {
    this.guestUsername.set(username);
  }

  onSearchModalQueryChange(query: string): void {
    this.onSearchInput(query);
  }

  onSearchModalNavigate(messageId: string): void {
    this.navigateToMessage(messageId);
  }

  navigateToMessage(messageId: string): void {
    const messageElement = document.querySelector(
      `[data-message-id="${messageId}"]`
    );
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('animate-pulse');
      setTimeout(() => {
        messageElement.classList.remove('animate-pulse');
      }, 2000);
    }
    this.showSearch.set(false);
  }

  // Settings methods using service
  toggleSound(): void {
    this.chatService.toggleSound();
    // Play sound to demonstrate it's working
    const settings = this.chatService.getSettings();
    if (settings.soundEnabled) {
      this.soundService.playSound('ding');
    }
  }

  toggleNotifications(): void {
    this.chatService.toggleNotifications();
    // Play notification sound when enabling
    const settings = this.chatService.getSettings();
    if (settings.notificationsEnabled && settings.soundEnabled) {
      this.soundService.playSound('notification');
    }
  }

  toggleTheme(): void {
    const currentTheme = this.chatService.getSettings().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.chatService.setTheme(newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');

    // Play sound effect when changing theme
    const settings = this.chatService.getSettings();
    if (settings.soundEnabled) {
      this.soundService.playSound('pop');
    }
  }

  getSettings() {
    return this.chatService.getSettings();
  }

  // Language toggle
  toggleLanguage(): void {
    this.langService.toggleLang();
    this.currentLang.set(this.langService.getCurrentLang());
  }

  getCurrentLang(): string {
    return this.langService.getCurrentLang();
  }

  // Music controls
  async toggleMusic(): Promise<void> {
    this.chatService.toggleMusic();
    const settings = this.chatService.getSettings();

    // Sync music service with ChatService settings
    this.musicService.setEnabled(settings.musicEnabled);
    this.musicService.setVolume(settings.musicVolume);

    if (settings.musicEnabled) {
      await this.musicService.playMusic();
    }
  }

  setMusicVolume(volume: number): void {
    this.chatService.setMusicVolume(volume);
    this.musicService.setVolume(volume);
  }
}
