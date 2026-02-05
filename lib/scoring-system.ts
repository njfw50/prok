/**
 * Karaoke Scoring System
 * Real-time performance evaluation and feedback
 * @module lib/scoring-system
 */

interface ScoringResult {
  overallScore: number;
  accuracy: number;
  rhythm: number;
  pitchAccuracy: number;
  consistency: number;
  rating: 'Perfect' | 'Great' | 'Good' | 'Fair' | 'Poor';
  feedback: string[];
}

interface PerformanceFrame {
  timestamp: number;
  expectedFrequency: number;
  userFrequency: number;
  confidence: number;
}

export class KaraokeScoringSystem {
  private frames: PerformanceFrame[] = [];
  private startTime: number = 0;
  private expectedNotes: Array<{ time: number; frequency: number }> = [];

  /**
   * Initialize scoring with song data
   */
  public initialize(song: any): void {
    this.frames = [];
    this.startTime = Date.now();
    this.expectedNotes = this.extractNotesFromSong(song);
  }

  /**
   * Record a performance frame
   */
  public recordFrame(
    timestamp: number,
    expectedFrequency: number,
    userFrequency: number,
    confidence: number = 1.0,
  ): void {
    this.frames.push({
      timestamp,
      expectedFrequency,
      userFrequency,
      confidence,
    });
  }

  /**
   * Calculate final score
   */
  public calculateFinalScore(): ScoringResult {
    if (this.frames.length === 0) {
      return {
        overallScore: 0,
        accuracy: 0,
        rhythm: 0,
        pitchAccuracy: 0,
        consistency: 0,
        rating: 'Poor',
        feedback: ['No performance data recorded'],
      };
    }

    const accuracy = this.calculateAccuracy();
    const rhythm = this.calculateRhythm();
    const pitchAccuracy = this.calculatePitchAccuracy();
    const consistency = this.calculateConsistency();

    const overallScore = (accuracy + rhythm + pitchAccuracy + consistency) / 4;
    const rating = this.getRating(overallScore);
    const feedback = this.generateFeedback(accuracy, rhythm, pitchAccuracy, consistency);

    return {
      overallScore: Math.round(overallScore),
      accuracy: Math.round(accuracy),
      rhythm: Math.round(rhythm),
      pitchAccuracy: Math.round(pitchAccuracy),
      consistency: Math.round(consistency),
      rating,
      feedback,
    };
  }

  /**
   * Calculate pitch accuracy (0-100)
   */
  private calculatePitchAccuracy(): number {
    let totalDiff = 0;
    let validFrames = 0;

    for (const frame of this.frames) {
      if (frame.userFrequency > 0) {
        const diff = Math.abs(frame.userFrequency - frame.expectedFrequency);
        // Convert to cents (100 cents = 1 semitone)
        const cents = 1200 * Math.log2(frame.userFrequency / frame.expectedFrequency);
        totalDiff += Math.abs(cents);
        validFrames++;
      }
    }

    if (validFrames === 0) return 0;

    const avgDiff = totalDiff / validFrames;
    // Max tolerance: 50 cents (half semitone)
    return Math.max(0, 100 - avgDiff / 0.5);
  }

  /**
   * Calculate rhythm accuracy (0-100)
   */
  private calculateRhythm(): number {
    let onTimeFrames = 0;

    for (const frame of this.frames) {
      const closestNote = this.findClosestNote(frame.timestamp);
      if (closestNote && Math.abs(frame.timestamp - closestNote.time) < 200) {
        onTimeFrames++;
      }
    }

    return (onTimeFrames / this.frames.length) * 100;
  }

  /**
   * Calculate accuracy (proportion of notes hit)
   */
  private calculateAccuracy(): number {
    let hitNotes = 0;

    for (const note of this.expectedNotes) {
      const hitFrame = this.frames.find(
        (f) => Math.abs(f.timestamp - note.time) < 300 && f.userFrequency > 0,
      );
      if (hitFrame) hitNotes++;
    }

    return (hitNotes / this.expectedNotes.length) * 100;
  }

  /**
   * Calculate consistency (standard deviation of accuracy)
   */
  private calculateConsistency(): number {
    if (this.frames.length < 2) return 50;

    const scores = this.frames.map((frame) => {
      const diff = Math.abs(frame.userFrequency - frame.expectedFrequency);
      return Math.max(0, 100 - diff / 10);
    });

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    return Math.max(0, 100 - stdDev);
  }

  /**
   * Get rating based on score
   */
  private getRating(score: number): 'Perfect' | 'Great' | 'Good' | 'Fair' | 'Poor' {
    if (score >= 95) return 'Perfect';
    if (score >= 85) return 'Great';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  }

  /**
   * Generate feedback based on performance
   */
  private generateFeedback(
    accuracy: number,
    rhythm: number,
    pitchAccuracy: number,
    consistency: number,
  ): string[] {
    const feedback: string[] = [];

    if (pitchAccuracy < 70) {
      feedback.push('🎵 Work on hitting the correct pitch');
    } else if (pitchAccuracy > 90) {
      feedback.push('🎵 Excellent pitch control!');
    }

    if (rhythm < 70) {
      feedback.push('⏱️ Pay attention to the timing');
    } else if (rhythm > 90) {
      feedback.push('⏱️ Perfect timing!');
    }

    if (accuracy < 60) {
      feedback.push('📝 You missed many notes, try again!');
    } else if (accuracy > 85) {
      feedback.push('📝 Great note coverage!');
    }

    if (consistency < 60) {
      feedback.push('🎯 Try to be more consistent throughout');
    } else if (consistency > 80) {
      feedback.push('🎯 Very consistent performance!');
    }

    if (feedback.length === 0) {
      feedback.push('✨ Well done!');
    }

    return feedback;
  }

  /**
   * Find closest expected note to timestamp
   */
  private findClosestNote(timestamp: number): { time: number; frequency: number } | null {
    let closest: { time: number; frequency: number } | null = null;
    let minDiff = Infinity;

    for (const note of this.expectedNotes) {
      const diff = Math.abs(timestamp - note.time);
      if (diff < minDiff) {
        minDiff = diff;
        closest = note;
      }
    }

    return closest;
  }

  /**
   * Extract notes from song lyrics (mock implementation)
   */
  private extractNotesFromSong(song: any): Array<{ time: number; frequency: number }> {
    // In real implementation, this would analyze the audio file
    // For now, return simulated notes based on lyrics timestamps
    return song.lyrics.map((lyric: any, index: number) => ({
      time: lyric.timestamp,
      frequency: 440 + index * 10, // Simulate ascending notes
    }));
  }

  /**
   * Reset scoring data
   */
  public reset(): void {
    this.frames = [];
    this.startTime = 0;
    this.expectedNotes = [];
  }

  /**
   * Get performance data for visualization
   */
  public getPerformanceData() {
    return {
      totalFrames: this.frames.length,
      frames: this.frames,
      expectedNotes: this.expectedNotes,
    };
  }
}

export type { ScoringResult, PerformanceFrame };
