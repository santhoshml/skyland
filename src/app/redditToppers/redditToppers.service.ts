import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  favorites: () => `/tradingIdeas/favorites`,
  redditToppers: (rows: number) => `/redittStocks/list/${rows}`,
};

@Injectable({
  providedIn: 'root',
})
export class RedditToppersService {
  constructor(private httpClient: HttpClient) {}

  getRedditToppers(rows: number): Observable<any> {
    return this.httpClient
      .get(routes.redditToppers(rows), {
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
