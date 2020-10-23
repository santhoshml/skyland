import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ListCard } from './listCards.component';

const routes = {
  quote: () => `/data/prediction/groups`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListCardsService {
  constructor(private httpClient: HttpClient) {}

  getAllCards(): Observable<ListCard[] | string> {
    return this.httpClient.get(routes.quote(), 
    {
      withCredentials: true
    }).pipe(
      map((body: ListCard[]) => body),
      catchError((err) => {
        console.log(`err: ${JSON.stringify(err)}`);
        return throwError(err);
      })
    );
  }

  getAccessToken(OuthToken: string, oauth_verifier: string) {
    let oAuth_consumer_key = 'YG3PKk3xIuX5m3ufbrhPEKPaR';

  }
}
