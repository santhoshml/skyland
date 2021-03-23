import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// quote: () => `/data/prediction/groups`,
const routes = {
  recordEmoji: () => `/feedback/emoji`,
  recordComments: () => `/feedback/comments`,
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

  keyword = 'name';
  data = [
    {
      id: 1,
      name: 'Usa',
    },
    {
      id: 2,
      name: 'England',
    },
  ];

  selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }
}
