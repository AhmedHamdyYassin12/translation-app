import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TranslationResponse {
  responseData: {
    translatedText: string;
  };
}

interface Language {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'https://api.mymemory.translated.net/get';

  constructor(private http: HttpClient) { }

  translate(text: string, targetLang: string, sourceLang: string): Observable<TranslationResponse> {
    const params = {
      q: text,
      langpair: `${sourceLang}|${targetLang}`
    };

    return this.http.get<TranslationResponse>(this.apiUrl, { params });
  }

  getSupportedLanguages(): Observable<Language[]> {
    // MyMemory doesn't have a languages endpoint, so we'll return a static list
    return new Observable<Language[]>(subscriber => {
      subscriber.next([
        { code: 'de', name: 'German' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'es', name: 'Spanish' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ar', name: 'Arabic' }
      ]);
      subscriber.complete();
    });
  }
}
