/**
 * Advanced Audio Engine for Karaoke
 * Web Audio API with effects, EQ, and real-time processing
 * @module lib/audio-engine
 */

interface AudioConfig {
  volume: number;
  bass: number;
  middle: number;
  treble: number;
  reverb: number;
  echo: number;
}

interface PerformanceMetrics {
  score: number;
  accuracy: number;
  notes: number;
  missedNotes: number;
  timing: number;
}

export class KaraokeAudioEngine {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private middleFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private micGain: GainNode | null = null;
  private isPlaying = false;
  private startTime = 0;
  private pausedTime = 0;
  private config: AudioConfig = {
    volume: 100,
    bass: 0,
    middle: 0,
    treble: 0,
    reverb: 0,
    echo: 0,
  };

  constructor() {}

  /**
   * Initialize audio context
   */
  public async initialize(): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create filter nodes for EQ
    this.bassFilter = this.audioContext.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.value = 60;

    this.middleFilter = this.audioContext.createBiquadFilter();
    this.middleFilter.type = 'peaking';
    this.middleFilter.frequency.value = 1000;
    this.middleFilter.Q.value = 0.5;

    this.trebleFilter = this.audioContext.createBiquadFilter();
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.value = 12000;

    // Create gain node for volume control
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1;

    // Create analyser for frequency analysis
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    // Connect filter chain: source -> bass -> middle -> treble -> gain -> analyser -> destination
    this.bassFilter.connect(this.middleFilter);
    this.middleFilter.connect(this.trebleFilter);
    this.trebleFilter.connect(this.gainNode!);
    this.gainNode!.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  /**
   * Load audio from URL
   */
  public async loadAudio(url: string): Promise<void> {
    if (!this.audioContext) await this.initialize();

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
  }

  /**
   * Play audio track
   */
  public play(): void {
    if (!this.audioContext || !this.audioBuffer || !this.bassFilter) return;

    if (this.isPlaying) return;

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.bassFilter);

    const offset = this.pausedTime / 1000;
    this.sourceNode.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.isPlaying = true;
  }

  /**
   * Pause audio
   */
  public pause(): void {
    if (!this.sourceNode || !this.isPlaying) return;

    this.sourceNode.stop();
    this.pausedTime = (this.audioContext!.currentTime - this.startTime) * 1000;
    this.isPlaying = false;
  }

  /**
   * Stop audio completely
   */
  public stop(): void {
    if (this.sourceNode && this.isPlaying) {
      this.sourceNode.stop();
    }
    this.pausedTime = 0;
    this.isPlaying = false;
  }

  /**
   * Get current playback time in milliseconds
   */
  public getCurrentTime(): number {
    if (!this.audioContext || !this.isPlaying) {
      return this.pausedTime;
    }
    return (this.audioContext.currentTime - this.startTime) * 1000;
  }

  /**
   * Seek to specific time (ms)
   */
  public seek(timeMs: number): void {
    if (this.isPlaying) {
      this.pause();
    }
    this.pausedTime = timeMs;
  }

  /**
   * Set volume (0-100)
   */
  public setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(100, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.config.volume / 100;
    }
  }

  /**
   * Set bass EQ (-12 to +12)
   */
  public setBass(value: number): void {
    this.config.bass = value;
    if (this.bassFilter) {
      this.bassFilter.gain.value = value;
    }
  }

  /**
   * Set middle EQ (-12 to +12)
   */
  public setMiddle(value: number): void {
    this.config.middle = value;
    if (this.middleFilter) {
      this.middleFilter.gain.value = value;
    }
  }

  /**
   * Set treble EQ (-12 to +12)
   */
  public setTreble(value: number): void {
    this.config.treble = value;
    if (this.trebleFilter) {
      this.trebleFilter.gain.value = value;
    }
  }

  /**
   * Get frequency data for visualization
   */
  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array();

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Get waveform data for visualization
   */
  public getWaveformData(): Uint8Array {
    if (!this.analyser) return new Uint8Array();

    const dataArray = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Initialize microphone input for scoring
   */
  public async initializeMicrophone(): Promise<void> {
    if (!this.audioContext) await this.initialize();

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const micSource = this.audioContext!.createMediaStreamSource(this.micStream);
      
      this.micGain = this.audioContext!.createGain();
      this.micGain.gain.value = 0.5;

      micSource.connect(this.micGain);
      this.micGain.connect(this.audioContext!.destination);
    } catch (error) {
      console.error('Failed to initialize microphone:', error);
      throw error;
    }
  }

  /**
   * Stop microphone input
   */
  public stopMicrophone(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
  }

  /**
   * Calculate performance score based on accuracy
   */
  public calculateScore(userFrequency: number, targetFrequency: number): number {
    const frequencyDiff = Math.abs(userFrequency - targetFrequency);
    const maxDiff = 50; // Hz tolerance

    if (frequencyDiff > maxDiff) return 0;

    // Linear scoring: perfect match = 100, max tolerance = 0
    return Math.max(0, 100 - (frequencyDiff / maxDiff) * 100);
  }

  /**
   * Get current audio configuration
   */
  public getConfig(): AudioConfig {
    return { ...this.config };
  }

  /**
   * Reset all effects to default
   */
  public resetEffects(): void {
    this.setBass(0);
    this.setMiddle(0);
    this.setTreble(0);
    this.setVolume(100);
  }

  /**
   * Cleanup and close audio context
   */
  public async cleanup(): Promise<void> {
    this.stop();
    this.stopMicrophone();
    
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export type { AudioConfig, PerformanceMetrics };
