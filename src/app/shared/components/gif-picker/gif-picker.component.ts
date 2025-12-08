import { Component, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

interface Gif {
  id: string;
  url: string;
  title: string;
  preview: string;
}

@Component({
  selector: 'app-gif-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gif-picker.component.html',
  styleUrl: './gif-picker.component.css',
})
export class GifPickerComponent {
  gifSelected = output<string>();
  private http = inject(HttpClient);

  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  gifs = signal<Gif[]>([]);
  isLoading = signal<boolean>(false);
  trendingGifs = signal<Gif[]>([]);

  // Using Giphy API (you'll need to add your API key)
  private readonly GIPHY_API_KEY = 'YOUR_GIPHY_API_KEY'; // Replace with your API key
  private readonly GIPHY_API_URL = 'https://api.giphy.com/v1/gifs';

  constructor() {
    effect(() => {
      if (this.isOpen() && this.trendingGifs().length === 0) {
        this.loadTrending();
      }
    });

    effect(() => {
      if (this.searchQuery().trim()) {
        this.searchGifs(this.searchQuery());
      } else if (this.isOpen()) {
        this.loadTrending();
      }
    });
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
    if (!this.isOpen()) {
      this.searchQuery.set('');
    }
  }

  async loadTrending(): Promise<void> {
    if (this.trendingGifs().length > 0) {
      this.gifs.set(this.trendingGifs());
      return;
    }

    this.isLoading.set(true);
    try {
      // For demo purposes, using mock data. Replace with actual API call:
      // const response = await this.http.get(`${this.GIPHY_API_URL}/trending?api_key=${this.GIPHY_API_KEY}&limit=20`).toPromise();
      
      // Mock trending GIFs for demo
      const mockGifs: Gif[] = [
        { id: '1', url: 'https://media.giphy.com/media/3o7aCTPPm4OHbRLSH6/giphy.gif', title: 'Happy Dance', preview: 'https://media.giphy.com/media/3o7aCTPPm4OHbRLSH6/giphy-preview.gif' },
        { id: '2', url: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif', title: 'Excited', preview: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy-preview.gif' },
        { id: '3', url: 'https://media.giphy.com/media/3o7abldet0lRBPfX44/giphy.gif', title: 'Celebration', preview: 'https://media.giphy.com/media/3o7abldet0lRBPfX44/giphy-preview.gif' },
        { id: '4', url: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif', title: 'Party', preview: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy-preview.gif' },
        { id: '5', url: 'https://media.giphy.com/media/3o7aD2saQqgIZlF0SQ/giphy.gif', title: 'Fun', preview: 'https://media.giphy.com/media/3o7aD2saQqgIZlF0SQ/giphy-preview.gif' },
        { id: '6', url: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif', title: 'Wow', preview: 'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy-preview.gif' },
        { id: '7', url: 'https://media.giphy.com/media/3o7aCTPPm4OHbRLSH6/giphy.gif', title: 'Amazing', preview: 'https://media.giphy.com/media/3o7aCTPPm4OHbRLSH6/giphy-preview.gif' },
        { id: '8', url: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif', title: 'Awesome', preview: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy-preview.gif' },
      ];
      
      this.trendingGifs.set(mockGifs);
      this.gifs.set(mockGifs);
    } catch (error) {
      console.error('Error loading trending GIFs:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async searchGifs(query: string): Promise<void> {
    if (!query.trim()) {
      this.loadTrending();
      return;
    }

    this.isLoading.set(true);
    try {
      // For demo purposes, using mock data. Replace with actual API call:
      // const response = await this.http.get(`${this.GIPHY_API_URL}/search?api_key=${this.GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20`).toPromise();
      
      // Mock search results
      const mockResults: Gif[] = Array.from({ length: 12 }, (_, i) => ({
        id: `search-${i}`,
        url: `https://media.giphy.com/media/3o7aCTPPm4OHbRLSH6/giphy.gif`,
        title: `${query} ${i + 1}`,
        preview: `https://media.giphy.com/media/3o7aCTPPm4OHbRLSH6/giphy-preview.gif`,
      }));
      
      this.gifs.set(mockResults);
    } catch (error) {
      console.error('Error searching GIFs:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectGif(gif: Gif): void {
    this.gifSelected.emit(gif.url);
    this.isOpen.set(false);
  }
}

