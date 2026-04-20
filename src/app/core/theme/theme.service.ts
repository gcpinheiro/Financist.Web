import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'financist.theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly themeState = signal<AppTheme>('light');

  readonly theme = this.themeState.asReadonly();

  initialize(): void {
    const theme = this.readStoredTheme() ?? 'light';
    this.applyTheme(theme);
  }

  setTheme(theme: AppTheme): void {
    this.applyTheme(theme);
    this.persistTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    this.themeState.set(theme);

    if (!this.isBrowser()) {
      return;
    }

    this.document.documentElement.dataset['theme'] = theme;
    this.document.documentElement.style.colorScheme = theme;
  }

  private readStoredTheme(): AppTheme | null {
    if (!this.isBrowser()) {
      return null;
    }

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : null;
  }

  private persistTheme(theme: AppTheme): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
