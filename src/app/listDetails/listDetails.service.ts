import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ListDetails } from './listDetails.component';

const routes = {
  // listDetails: (key : number) => `/predictions/${key}`,
  listDetails: (key: number) => `/tradingIdeas/${key}`,
  listDetailsFavorites: (key: number) => `/tradingIdeas/favorites`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListDetailsService {
  constructor(private httpClient: HttpClient) {}

  getListDetails(key: number): Observable<ListDetails[] | string> {
    if (key === 1002) {
      return this.getFavoritesListDetails(key);
    } else {
      return this.getListDetailsForTradingIdea(key);
    }
  }

  getListDetailsForTradingIdea(key: number): Observable<ListDetails[] | string> {
    return this.httpClient.get(routes.listDetails(key)).pipe(
      map((body: ListDetails[]) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }

  getFavoritesListDetails(key: number): Observable<ListDetails[] | string> {
    return this.httpClient.get(routes.listDetailsFavorites(key)).pipe(
      map((body: ListDetails[]) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }
}
