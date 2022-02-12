import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  unsubscribe: () => `/unsubscribe/user`,
};

@Injectable({
  providedIn: 'root',
})
export class UnsubscribeService {
  unsubscribe(data: any) {
    return this.httpClient.post(routes.unsubscribe(), data, { withCredentials: true }).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not POST unsubscribe details :-('))
    );
  }
  constructor(private httpClient: HttpClient) {}
}
