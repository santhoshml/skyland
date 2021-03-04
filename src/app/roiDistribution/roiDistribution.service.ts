import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// quote: () => `/data/prediction/groups`,
const routes = {
  distribution: () => `/txn/distribution`,
  txnStats: () => `/user/txnStats`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoiDistributionService {
  constructor(private httpClient: HttpClient) {}

  getDistribution(): Observable<any | string> {
    return this.httpClient
      .get(routes.distribution(), {
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

  getTxnStats(): Observable<any | string> {
    return this.httpClient
      .get(routes.txnStats(), {
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
