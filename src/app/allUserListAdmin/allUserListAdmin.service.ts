import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  allUsers: () => `/allUsers`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class AllUserListAdminService {
  constructor(private httpClient: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.httpClient.get(routes.allUsers()).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }
}
