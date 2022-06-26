import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  disableUser: () => '/user/disable',
  enableUser: () => '/user/enable',
  toggleDailyEmail: () => '/user/dailyEmail',
  userDetailsAdmin: (email) => `/user/${email}/details/admin`,
  sendDailyEmail: (email: string) => `/recommendations/userEmail/${email}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminUsersDetailsService {
  getUserDetailsAdmin(email: string) {
    return this.httpClient
      .get(routes.userDetailsAdmin(email), {
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

  toggleDailyEmail(data: any) {
    return this.httpClient
      .put(routes.toggleDailyEmail(), data, {
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

  disableUser(data: any) {
    return this.httpClient
      .post(routes.disableUser(), data, {
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

  enableUser(data: any) {
    return this.httpClient
      .post(routes.enableUser(), data, {
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

  sendDailyEmail(email: string) {
    return this.httpClient
      .post(routes.sendDailyEmail(email), null, {
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

  constructor(private httpClient: HttpClient) {}
}
