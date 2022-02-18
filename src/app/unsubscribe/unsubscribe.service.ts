import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  unsubscribe: () => `/unsubscribe/user`,
};

@Injectable({
  providedIn: 'root',
})
export class UnsubscribeService {
  constructor(private httpClient: HttpClient) {}

  unsubscribeEmail(data): Observable<any> {
    return this.httpClient
      .post(routes.unsubscribe(), data, {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
