import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  topStocks: () => `/stocks/top`,
  yourBest: () => `/predictions/2/addLimit/1`,
  addOpenPositions : () => `/user/txn/open`,
  getOpenPositions : () => `/user/txn/open`,
  closePositions : () => `/user/txn/close`,
  getClosePositions : () => `/user/txn/close`,
  getPriceObject : (symbol: string) => `/price/symbol/${symbol}`,
  deleteOpenPosition : (id: number) => `/user/txn/delete/${id}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class TopPicksService {
  constructor(private httpClient: HttpClient) {}

  deleteOpenPosition(id: number): Observable<any> {
    return this.httpClient
      .delete(routes.deleteOpenPosition(id), {
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

  getPriceObject(symbol: string): Observable<any> {
    return this.httpClient
      .get(routes.getPriceObject(symbol), {
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

  getClosePositions(): Observable<any> {
    return this.httpClient
      .get(routes.getClosePositions(), {
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

  closePosition(data:any): Observable<any> {
    return this.httpClient
      .post(routes.closePositions(), data, {
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


  getOpenPositions(): Observable<any> {
    return this.httpClient
      .get(routes.getOpenPositions(), {
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

  addOpenPosition(data:any): Observable<any> {
    return this.httpClient
      .post(routes.addOpenPositions(), data, {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => {
          // console.log(`In addOpenPosition ${JSON.stringify(body)}`);
          return body;
        }),
        catchError((err) => {
          // console.log(`err: ${JSON.stringify(err)}`);
          return throwError(err);
        })
      );
  }

  getTopStocks(): Observable<any> {
    return this.httpClient
      .get(routes.topStocks(), {
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

  getYourBestStocks(): Observable<any> {
    return this.httpClient
      .get(routes.yourBest(), {
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