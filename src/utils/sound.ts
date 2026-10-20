// Web Audio API Synthesizer for Dreamy Play
// Completely self-contained, offline-ready, no external audio files required!

class DreamyAudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private soundVolume: number = 0.8;
  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  }

  public setVolume(vol: number) {
    this.soundVolume = Math.max(0, Math.min(1, vol));
  }

  // Play a soft, cute pop/click for buttons
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.2 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext safety
    }
  }

  // Cheerful sparkle arpeggio for correct answer
  public playCorrect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = now + idx * 0.07;
        const dur = 0.25;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25 * this.soundVolume, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + dur);
      });
    } catch {
      // AudioContext safety
    }
  }

  // Funny cute cartoon wobble for wrong answer
  public playWrong() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

      gain.gain.setValueAtTime(0.2 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // AudioContext safety
    }
  }

  // Coin collect double-ding chime
  public playCoin() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, i) => { // B5, E6
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + i * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25 * this.soundVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      });
    } catch {
      // AudioContext safety
    }
  }

  // Star collect sparkling bell
  public playStar() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [1046.5, 1318.5, 1567.98, 2093.0];
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2 * this.soundVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {
      // AudioContext safety
    }
  }

  // Cute giggle squeak when tapping Lumi
  public playGiggle() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chirps = [600, 750, 900, 1100, 950];
      chirps.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq + 150, t + 0.04);

        gain.gain.setValueAtTime(0.25 * this.soundVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.06);
      });
    } catch {
      // AudioContext safety
    }
  }

  // Bubble pop
  public playPop() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.3 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // AudioContext safety
    }
  }

  // Triumphant Fanfare for Level Up or completing a game
  public playFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Fanfare sequence: C4 - E4 - G4 - C5 - pause - G4 - C5 (longer)
      const sequence = [
        { f: 523.25, d: 0.12, w: 0 },
        { f: 659.25, d: 0.12, w: 0.14 },
        { f: 783.99, d: 0.14, w: 0.28 },
        { f: 1046.5, d: 0.35, w: 0.44 },
        { f: 880.00, d: 0.15, w: 0.82 },
        { f: 1046.5, d: 0.55, w: 1.00 },
      ];

      const now = this.ctx.currentTime;
      sequence.forEach(item => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const t = now + item.w;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3 * this.soundVolume, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + item.d);
      });
    } catch {
      // AudioContext safety
    }
  }

  // Dreamy Background Music loop using soft bell-like sine waves
  public startBGM() {
    if (this.isBgmPlaying || !this.musicEnabled) return;
    this.isBgmPlaying = true;
    this.playBgmPattern();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  private playBgmPattern() {
    if (!this.isBgmPlaying || !this.musicEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Dreamy pentatonic chord progression (Cmaj7 - Am7 - Fmaj7 - G7)
      // Soft celesta / music box feel
      const chords = [
        [523.25, 659.25, 783.99, 987.77], // C, E, G, B
        [440.00, 523.25, 659.25, 783.99], // A, C, E, G
        [349.23, 440.00, 523.25, 659.25], // F, A, C, E
        [392.00, 493.88, 587.33, 783.99], // G, B, D, G
      ];

      const now = this.ctx.currentTime;
      const stepDur = 0.45;

      chords.forEach((chord, cIdx) => {
        const chordStart = now + cIdx * (stepDur * 4);
        chord.forEach((freq, noteIdx) => {
          const t = chordStart + noteIdx * stepDur;
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.06 * this.soundVolume, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + stepDur * 1.5);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(t);
          osc.stop(t + stepDur * 1.5);
        });
      });

      // Repeat pattern loop every 7.5 seconds
      const loopDuration = chords.length * stepDur * 4 * 1000;
      this.bgmTimeoutId = window.setTimeout(() => {
        if (this.isBgmPlaying && this.musicEnabled) {
          this.playBgmPattern();
        }
      }, loopDuration - 200);
    } catch {
      // AudioContext safety
    }
  }
}

export const soundManager = new DreamyAudioEngine();
