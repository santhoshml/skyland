import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  sectorDetails: (key: string) => `/sector/details/${key}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class SectorDetailsService {
  constructor(private httpClient: HttpClient) {}

  getSectorDetails(key: string, rows: number): Observable<any> {
    return this.httpClient.get(routes.sectorDetails(key)).pipe(
      map((body: any) => {
        body.list = body.list.slice(0, rows);
        return body;
      }),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }
}
