export class RomanticPianoSynth {
  private audio: HTMLAudioElement;
  private isPlaying: boolean = false;

  constructor() {
    this.audio = new Audio("/music/pihu.mp3"); // song name
    this.audio.loop = true;
    this.audio.volume = 0.50;
  }

  public start() {
    if (this.isPlaying) return;

    this.audio.play().catch((err) => {
      console.error("Audio failed:", err);
    });

    this.isPlaying = true;
  }

  public stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  public toggle(force?: boolean) {
    const shouldPlay =
      force !== undefined ? force : !this.isPlaying;

    if (shouldPlay) {
      this.start();
    } else {
      this.stop();
    }

    return this.isPlaying;
  }

  public getPlaying() {
    return this.isPlaying;
  }
}