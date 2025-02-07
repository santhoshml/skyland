import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// quote: () => `/data/prediction/groups`,
const routes = {
  recordEmoji: () => `/feedback/emoji`,
  recordComments: () => `/feedback/comments`,
  getAllSymbols: () => `/stocks/all/symbolAndNames`,
  signupWithoutPassword: () => `/signupWithoutPassword`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(private httpClient: HttpClient) {}

  updateEmojiValue(data: any): Observable<any> {
    return this.httpClient
      .post(routes.recordEmoji(), data, {
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

  recordUserFeedback(data: any): Observable<any> {
    return this.httpClient
      .post(routes.recordComments(), data, {
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

  signupWithoutPassword(data: any): Observable<any> {
    return this.httpClient
      .post(routes.signupWithoutPassword(), data, {
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

  getAllSymbols(): Observable<any> {
    return this.httpClient
      .get(routes.getAllSymbols(), {
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
