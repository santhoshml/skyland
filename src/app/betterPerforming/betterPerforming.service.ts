import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  indexWeeklyGains: () => `/indexes/weeklyGains`,
  beatNasdaq: () => `/uptrendingStocks/beatInPerformance/index/QQQ`,
  uptrendingStocks: () => `/stocks/uptrending`,
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
export class BetterPerformingService {
  constructor(private httpClient: HttpClient) {}

  getIndexWeeklyGains(): Observable<any> {
    return this.httpClient
      .get(routes.indexWeeklyGains(), {
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

  getBeatNasdaq(rows: number): Observable<any> {
    return this.httpClient
      .get(routes.beatNasdaq(), {
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
