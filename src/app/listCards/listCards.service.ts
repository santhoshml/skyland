import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
    return this.httpClient.get(routes.quote()).pipe(
      map((body: ListCard[]) => body),
      catchError(() => of('Error, could not load joke :-('))
    );
  }
}
