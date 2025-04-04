import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService, SavedTranslation } from '../../services/storage.service';

@Component({
  selector: 'app-saved-words',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-words.component.html',
  styleUrl: './saved-words.component.scss'
})
export class SavedWordsComponent implements OnInit {
  savedTranslations: SavedTranslation[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.loadSavedTranslations();
  }

  loadSavedTranslations() {
    this.savedTranslations = this.storageService.getSavedTranslations();
  }

  deleteTranslation(index: number) {
    this.storageService.deleteTranslation(index);
    this.loadSavedTranslations();
  }

  clearAll() {
    if (confirm('Are you sure you want to delete all saved translations?')) {
      this.storageService.clearAllTranslations();
      this.loadSavedTranslations();
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}
