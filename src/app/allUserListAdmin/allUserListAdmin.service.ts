import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  allUsers: () => `/allUsers`,
  disableUser: () => '/user/disable',
  enableUser: () => '/user/enable',
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class AllUserListAdminService {
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

  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.httpClient.get(routes.allUsers()).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }
}
