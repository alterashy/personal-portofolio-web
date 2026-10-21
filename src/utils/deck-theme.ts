
// src/utils/deck-theme.ts

export interface ThemeColor {
  id: 'cyan' | 'amber' | 'emerald' | 'orange';
  name: string;
  accent: string;
}

export const THEME_COLORS: ThemeColor[] = [
  { id: 'cyan', name: 'Cyan', accent: '#06B6D4' },
  { id: 'amber', name: 'Amber', accent: '#F59E0B' },
  { id: 'emerald', name: 'Emerald', accent: '#10B981' },
  { id: 'orange', name: 'Orange', accent: '#F0562E' },
];

export const CYCLE_INTERVAL_MS = 8000; // 8 seconds per color
const STORAGE_KEY_MODE = 'altera_deck_theme';
const STORAGE_KEY_PAUSED = 'altera_deck_paused';

class ThemeController {
  private currentIndex: number = 0;
  private isPaused: boolean = false;
  private timer: number | null = null;

  public init() {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const savedPaused = localStorage.getItem(STORAGE_KEY_PAUSED);
    this.isPaused = savedPaused !== null ? savedPaused === 'true' : prefersReducedMotion;

    const savedMode = localStorage.getItem(STORAGE_KEY_MODE) || localStorage.getItem('altera_deck_mode');
    // Map legacy 'acid' -> 'emerald', 'forge' -> 'orange'
    const normalizedMode = savedMode === 'acid' ? 'emerald' : savedMode === 'forge' ? 'orange' : savedMode;
    const foundIndex = THEME_COLORS.findIndex((m) => m.id === normalizedMode);
    this.currentIndex = foundIndex !== -1 ? foundIndex : 0;

    this.applyColor(this.currentIndex, false);

    if (!this.isPaused) {
      this.startCycle();
    }

    // Keyboard shortcut: Press 'T' to cycle colors
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key.toLowerCase() === 't') {
        this.nextColor(true);
      }
    });
  }

  public getCurrentColor(): ThemeColor {
    return THEME_COLORS[this.currentIndex];
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public setColor(colorId: string, manual: boolean = true) {
    const idx = THEME_COLORS.findIndex((m) => m.id === colorId);
    if (idx !== -1) {
      this.currentIndex = idx;
      this.applyColor(this.currentIndex, manual);
      if (manual) {
        this.resetCycleTimer();
      }
    }
  }

  public nextColor(manual: boolean = true) {
    this.currentIndex = (this.currentIndex + 1) % THEME_COLORS.length;
    this.applyColor(this.currentIndex, manual);
    if (manual) {
      this.resetCycleTimer();
    }
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    localStorage.setItem(STORAGE_KEY_PAUSED, String(this.isPaused));

    if (this.isPaused) {
      this.stopCycle();
    } else {
      this.startCycle();
    }

    this.dispatchChangeEvent();
    return this.isPaused;
  }

  private applyColor(index: number, persist: boolean) {
    const color = THEME_COLORS[index];
    document.documentElement.setAttribute('data-deck', color.id);

    try {
      localStorage.setItem(STORAGE_KEY_MODE, color.id);
      localStorage.setItem('altera_deck_mode', color.id);
    } catch (e) {}

    this.dispatchChangeEvent();
  }

  private startCycle() {
    this.stopCycle();
    this.timer = window.setInterval(() => {
      this.nextColor(false);
    }, CYCLE_INTERVAL_MS);
  }

  private stopCycle() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private resetCycleTimer() {
    if (!this.isPaused) {
      this.startCycle();
    }
  }

  private dispatchChangeEvent() {
    const color = this.getCurrentColor();
    const event = new CustomEvent('deckthemechange', {
      detail: {
        color,
        index: this.currentIndex,
        isPaused: this.isPaused,
        total: THEME_COLORS.length,
      },
    });
    window.dispatchEvent(event);
  }
}

let controllerInstance: ThemeController | null = null;

export function getThemeController(): ThemeController {
  if (!controllerInstance) {
    controllerInstance = new ThemeController();
  }
  return controllerInstance;
}

// Backwards compatibility alias
export const getDeckController = getThemeController;
export const DECK_MODES = THEME_COLORS;
