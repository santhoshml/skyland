import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ListCard } from './listCards.component';

// quote: () => `/data/prediction/groups`,
const routes = {
  quote: () => `/predictions/group/count`,
  topStocks: () => `/stocks/top`,
  yourBest: ()=>`/predictions/2/addLimit/1`
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

  getTopStocks(): Observable<any> {
    return this.httpClient.get(routes.topStocks(), 
    {
      withCredentials: true
    }).pipe(
      map((body: any) => body),
      catchError((err) => {
        console.log(`err: ${JSON.stringify(err)}`);
        return throwError(err);
      })
    );
  }

  getYourBestStocks(): Observable<any> {
    return this.httpClient.get(routes.yourBest(), 
    {
      withCredentials: true
    }).pipe(
      map((body: any) => body),
      catchError((err) => {
        console.log(`err: ${JSON.stringify(err)}`);
        return throwError(err);
      })
    );
  }
}
