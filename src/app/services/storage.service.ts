import { Injectable } from '@angular/core';

export interface SavedTranslation {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'saved_translations';

  constructor() { }

  saveTranslation(translation: SavedTranslation): void {
    const savedTranslations = this.getSavedTranslations();
    savedTranslations.unshift(translation);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedTranslations));
  }

  getSavedTranslations(): SavedTranslation[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  deleteTranslation(index: number): void {
    const savedTranslations = this.getSavedTranslations();
    savedTranslations.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedTranslations));
  }

  clearAllTranslations(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
