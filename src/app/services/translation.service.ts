import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface TranslationResponse {
  translations: Array<{
    text: string;
    detected_source_language: string;
  }>;
}

interface Language {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = environment.production 
    ? 'https://api-free.deepl.com/v2/translate'  // Production URL
    : '/api/v2/translate';  // Development URL with proxy

  constructor(private http: HttpClient) { }

  translate(text: string, targetLang: string, sourceLang: string): Observable<TranslationResponse> {
    const body = {
      text: [text],
      target_lang: targetLang.toUpperCase(),
      source_lang: sourceLang.toUpperCase()
    };

    console.log('Making translation request to:', this.apiUrl);
    console.log('Request body:', body);

    return this.http.post<TranslationResponse>(this.apiUrl, body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `DeepL-Auth-Key ${environment.deeplApiKey}`
      }
    }).pipe(
      map(response => {
        console.log('Translation response:', response);
        if (!response || !response.translations || !response.translations[0] || !response.translations[0].text) {
          throw new Error('Invalid translation response');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Translation error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          headers: error.headers,
          url: error.url
        });
        
        if (error.status === 0) {
          return throwError(() => new Error('Network error. Please check your connection and CORS settings.'));
        }
        if (error.status === 401) {
          return throwError(() => new Error('Invalid API key. Please check your credentials.'));
        }
        if (error.status === 429) {
          return throwError(() => new Error('Translation quota exceeded. Please try again later.'));
        }
        if (error.status === 403) {
          return throwError(() => new Error('Access forbidden. Please check your API key and permissions.'));
        }
        return throwError(() => new Error(`Translation failed: ${error.message || 'Unknown error'}`));
      })
    );
  }

  getSupportedLanguages(): Observable<Language[]> {
    return new Observable<Language[]>(subscriber => {
      subscriber.next([
        { code: 'DE', name: 'German' },
        { code: 'EN', name: 'English' },
        { code: 'FR', name: 'French' },
        { code: 'ES', name: 'Spanish' },
        { code: 'IT', name: 'Italian' },
        { code: 'PT', name: 'Portuguese' },
        { code: 'RU', name: 'Russian' },
        { code: 'JA', name: 'Japanese' },
        { code: 'ZH', name: 'Chinese' },
        { code: 'AR', name: 'Arabic' }
      ]);
      subscriber.complete();
    });
  }
}
