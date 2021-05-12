import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  uptrendingStocks: () => `/stocks/uptrending`,
  addOpenPositions: () => `/user/txn/open`,
  favorites: () => `/tradingIdeas/favorites`,
  deleteFavorites: (symbol: string) => `/favorites/symbol/${symbol}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class UptrendingStocksService {
  constructor(private httpClient: HttpClient) {}

  deleteFavorites(symbol: string): Observable<any> {
    return this.httpClient
      .delete(routes.deleteFavorites(symbol), {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
          // console.log(`err: ${JSON.stringify(err)}`);
          return throwError(err);
        })
      );
  }

  addOpenPosition(data: any): Observable<any> {
    return this.httpClient
      .post(routes.addOpenPositions(), data, {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => {
          // console.log(`In addOpenPosition ${JSON.stringify(body)}`);
          return body;
        }),
        catchError((err) => {
          // console.log(`err: ${JSON.stringify(err)}`);
          return throwError(err);
        })
      );
  }

  getUptrendingStocks(rows: number): Observable<any> {
    return this.httpClient
      .get(routes.uptrendingStocks(), {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => {
          return body.slice(0, rows);
        }),
        catchError((err) => {
          // console.log(`err: ${JSON.stringify(err)}`);
          return throwError(err);
        })
      );
  }

  getFavorites(): Observable<any> {
    return this.httpClient
      .get(routes.favorites(), {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
          // console.log(`err: ${JSON.stringify(err)}`);
          return throwError(err);
        })
      );
  }
}
