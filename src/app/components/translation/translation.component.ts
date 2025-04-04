import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from '../../services/translation.service';
import { StorageService, SavedTranslation } from '../../services/storage.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-translation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
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
    private storageService: StorageService,
    private snackBar: MatSnackBar
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
        this.showError(this.error);
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
        if (response && response.translations && response.translations[0] && response.translations[0].text) {
          this.translatedText = response.translations[0].text;
        } else {
          this.error = 'Invalid translation response';
          this.showError('Invalid translation response');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Translation error:', error);
        const errorMessage = error.message || 'Translation failed. Please try again later.';
        this.error = errorMessage;
        this.showError(errorMessage);
        this.translatedText = '';
        this.isLoading = false;
      }
    });
  }

  saveTranslation() {
    if (this.sourceText && this.translatedText) {
      const translation: SavedTranslation = {
        sourceText: this.sourceText,
        translatedText: this.translatedText,
        sourceLanguage: this.sourceLanguage,
        targetLanguage: this.targetLanguage,
        timestamp: Date.now()
      };
      this.storageService.saveTranslation(translation);
      this.showSuccess('Translation saved successfully!');
    } else {
      this.showError('No translation to save');
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
