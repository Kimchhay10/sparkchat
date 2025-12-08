import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = signal<boolean>(false);
  private volume = signal<number>(0.3); // Default 30% volume
  private musicEnabled = signal<boolean>(false);
  private audioContextStarted = false;

  // Background music file path
  private readonly musicPath = '/asset/music/bg-music.mp3';

  constructor() {
    // Load saved preferences from ChatService settings first
    const savedSettings = localStorage.getItem('sparkchat_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.musicVolume !== undefined) {
          this.volume.set(settings.musicVolume);
        }
        if (settings.musicEnabled !== undefined) {
          this.musicEnabled.set(settings.musicEnabled);
        }
      } catch (e) {
        // Fallback to individual localStorage items
        const savedVolume = localStorage.getItem('sparkchat_music_volume');
        const savedEnabled = localStorage.getItem('sparkchat_music_enabled');

        if (savedVolume) {
          this.volume.set(parseFloat(savedVolume));
        }

        if (savedEnabled === 'true') {
          this.musicEnabled.set(true);
        }
      }
    } else {
      // Fallback to individual localStorage items
      const savedVolume = localStorage.getItem('sparkchat_music_volume');
      const savedEnabled = localStorage.getItem('sparkchat_music_enabled');

      if (savedVolume) {
        this.volume.set(parseFloat(savedVolume));
      }

      if (savedEnabled === 'true') {
        this.musicEnabled.set(true);
      }
    }
  }

  private initializeAudio(): void {
    if (this.audio) {
      return;
    }

    this.audio = new Audio(this.musicPath);
    this.audio.loop = true;
    this.audio.volume = this.volume();
    this.audio.preload = 'auto';

    // Handle audio events
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Music file error, falling back to generated ambient:', e);
      // Fallback to Web Audio API if file fails
      if (!this.isPlaying()) {
        this.playWebAudioAmbient();
      }
    });

    this.audio.addEventListener('canplaythrough', () => {
      // Audio is ready to play
    });
  }

  private initializeAudioContext(): void {
    if (this.audioContext) {
      return;
    }

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('AudioContext not supported:', e);
    }
  }

  private async startAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        this.audioContextStarted = true;
      } catch (e) {
        console.warn('Could not resume audio context:', e);
      }
    } else if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContextStarted = true;
    }
  }

  // Generate ambient music using Web Audio API
  private playWebAudioAmbient(): void {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    if (!this.audioContext) {
      console.warn('AudioContext not available');
      return;
    }

    try {
      // Stop any existing oscillators
      this.stopMusic();

      // Create multiple oscillators for a richer ambient sound
      const frequencies = [220, 330, 440, 554]; // A3, E4, A4, C#5
      const types: OscillatorType[] = ['sine', 'sine', 'triangle', 'sine'];

      this.oscillators = [];
      const filter = this.audioContext.createBiquadFilter();
      this.gainNode = this.audioContext.createGain();

      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.5;

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext!.createOscillator();
        oscillator.type = types[index];
        oscillator.frequency.value = freq;

        // Add slight detuning for richness
        if (index > 0) {
          oscillator.frequency.value += (Math.random() - 0.5) * 2;
        }

        oscillator.connect(filter);
        this.oscillators.push(oscillator);
      });

      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Set volume
      this.gainNode.gain.value = this.volume() * 0.15; // Lower volume for ambient background

      // Start all oscillators
      this.oscillators.forEach((osc) => osc.start());

      // Create a subtle LFO for movement
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.value = 0.1; // Very slow modulation
      lfoGain.gain.value = 5; // Small frequency variation
      lfo.connect(lfoGain);

      // Modulate one oscillator slightly
      if (this.oscillators[1]) {
        lfoGain.connect(this.oscillators[1].frequency);
      }
      lfo.start();

      this.isPlaying.set(true);
    } catch (e) {
      console.error('Error creating ambient music:', e);
    }
  }

  toggleMusic(): void {
    this.musicEnabled.update((enabled) => !enabled);
    // Note: ChatService will handle localStorage persistence
    // This method is called by ChatService, so we just update our state

    if (this.musicEnabled()) {
      this.playMusic();
    } else {
      this.stopMusic();
    }
  }

  setEnabled(enabled: boolean): void {
    this.musicEnabled.set(enabled);
    if (enabled) {
      this.playMusic();
    } else {
      this.stopMusic();
    }
  }

  async playMusic(): Promise<void> {
    if (!this.musicEnabled()) {
      return;
    }

    // Initialize audio element
    this.initializeAudio();

    if (this.audio) {
      // Try to play the actual music file first
      this.audio.volume = this.volume();

      try {
        // Check if audio is ready
        if (this.audio.readyState >= 2) {
          // HAVE_CURRENT_DATA or higher
          await this.audio.play();
          this.isPlaying.set(true);
          console.log('🎵 Music started successfully');
          return; // Successfully playing music file
        } else {
          // Wait for audio to load
          const playWhenReady = async () => {
            try {
              await this.audio!.play();
              this.isPlaying.set(true);
              console.log('🎵 Music started after loading');
            } catch (error) {
              console.warn('Could not play after load:', error);
              await this.tryFallback();
            }
          };

          this.audio.addEventListener('canplay', playWhenReady, { once: true });

          // Also try to play immediately (might work if already loaded)
          try {
            await this.audio.play();
            this.isPlaying.set(true);
            console.log('🎵 Music started immediately');
            return;
          } catch (error: any) {
            // Will wait for canplay event
            console.log('⏳ Waiting for audio to load...');
          }
        }
      } catch (error: any) {
        console.warn('Could not play music file:', error.message);
        // Fallback to Web Audio API if file playback fails
        await this.tryFallback();
      }
    } else {
      // Fallback to Web Audio API
      await this.tryFallback();
    }
  }

  private async tryFallback(): Promise<void> {
    console.log('🔄 Trying fallback ambient music...');
    await this.startAudioContext();
    if (this.audioContextStarted) {
      this.playWebAudioAmbient();
      console.log('🎵 Fallback ambient music started');
    } else {
      console.warn('❌ Could not start audio context for fallback');
    }
  }

  stopMusic(): void {
    // Stop audio file if playing
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    // Stop all oscillators (fallback)
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped or disconnected
      }
    });
    this.oscillators = [];

    // Disconnect gain node
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {
        // Already disconnected
      }
      this.gainNode = null;
    }

    this.isPlaying.set(false);
  }

  setVolume(volume: number): void {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.volume.set(clampedVolume);
    // Note: ChatService will handle localStorage persistence

    // Update audio file volume if playing
    if (this.audio) {
      this.audio.volume = clampedVolume;
    }

    // Update gain node if playing (fallback)
    if (this.gainNode) {
      this.gainNode.gain.value = clampedVolume * 0.15; // Lower volume for ambient background
    }
  }

  getVolume(): number {
    return this.volume();
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled();
  }

  isMusicPlaying(): boolean {
    return this.isPlaying();
  }
}
