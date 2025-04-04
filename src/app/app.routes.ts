import { Routes } from '@angular/router';
import { TranslationComponent } from './components/translation/translation.component';
import { SavedWordsComponent } from './components/saved-words/saved-words.component';

export const routes: Routes = [
  { path: '', component: TranslationComponent },
  { path: 'saved', component: SavedWordsComponent },
  { path: '**', redirectTo: '' }
];
