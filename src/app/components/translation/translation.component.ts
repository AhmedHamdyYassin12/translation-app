import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { StorageService, SavedTranslation } from '../../services/storage.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-translation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translation.component.html',
  styleUrl: './translation.component.scss'
})
export class TranslationComponent implements OnInit {
  sourceText: string = '';
  translatedText: string = '';
  sourceLanguage: string = 'de';
  targetLanguage: string = 'en';
  supportedLanguages: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  private translateSubject = new Subject<string>();

  constructor(
    private translationService: TranslationService,
    private storageService: StorageService
  ) {
    this.translateSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(text => {
      this.translate();
    });
  }

  ngOnInit() {
    this.loadSupportedLanguages();
  }

  onTextChange(text: string) {
    this.sourceText = text;
    this.translateSubject.next(text);
  }

  loadSupportedLanguages() {
    this.isLoading = true;
    this.error = null;
    this.translationService.getSupportedLanguages().subscribe({
      next: (languages) => {
        this.supportedLanguages = languages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading languages:', error);
        this.error = 'Failed to load supported languages. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  translate() {
    if (!this.sourceText.trim()) {
      this.translatedText = '';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.translationService.translate(
      this.sourceText,
      this.targetLanguage,
      this.sourceLanguage
    ).subscribe({
      next: (response) => {
        if (response && response.responseData && response.responseData.translatedText) {
          this.translatedText = response.responseData.translatedText;
        } else {
          this.error = 'Invalid translation response';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Translation error:', error);
        this.error = 'Translation failed. Please try again later.';
        this.translatedText = '';
        this.isLoading = false;
      }
    });
  }

  saveTranslation() {
    if (!this.sourceText.trim() || !this.translatedText.trim()) return;

    const translation: SavedTranslation = {
      sourceText: this.sourceText,
      translatedText: this.translatedText,
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage,
      timestamp: Date.now()
    };

    this.storageService.saveTranslation(translation);
  }
}
