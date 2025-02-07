import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SubSectorDetailsTable } from './subSectorDetails.component';

const routes = {
  subSectorDetails: (key: string) => `/subsectors/details/${key}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubSectorDetailsService {
  constructor(private httpClient: HttpClient) {}

  getSubSectorDetails(key: string, rows: number): Observable<SubSectorDetailsTable[] | string> {
    return this.httpClient.get(routes.subSectorDetails(key)).pipe(
      map((body: any) => {
        body.list = body.list.slice(0, rows);
        return body;
      }),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }
}
