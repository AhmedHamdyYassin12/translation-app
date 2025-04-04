import { Injectable } from '@angular/core';

export interface SavedTranslation {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationHistoryService {
  private translations: SavedTranslation[] = [];

  constructor() {
    this.loadTranslations();
  }

  addTranslation(translation: SavedTranslation) {
    this.translations.unshift(translation);
    this.saveTranslations();
  }

  getTranslations(): SavedTranslation[] {
    return [...this.translations];
  }

  private loadTranslations() {
    const saved = localStorage.getItem('translations');
    if (saved) {
      this.translations = JSON.parse(saved);
    }
  }

  private saveTranslations() {
    localStorage.setItem('translations', JSON.stringify(this.translations));
  }
} 