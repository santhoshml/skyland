import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  indexWeeklyGains: () => `/indexes/weeklyGains`,
  beatNasdaq: () => `/uptrendingStocks/beatInPerformance/index/QQQ`,
  topStocks: () => `/stocks/top`,
  yourBest: () => `/predictions/2/addLimit/1`,
  indexSummary: () => `/index/summary`,
  topIndustry: () => `/industry/top`,
  addOpenPositions: () => `/user/v2/txn/open`,
  closePositions: () => `/user/txn/close`,
  getClosePositions: () => `/user/txn/close`,
  getPriceObject: (symbol: string) => `/price/symbol/${symbol}`,
  deleteOpenPosition: (id: number) => `/user/txn/delete/${id}`,
  favorites: () => `/tradingIdeas/favorites`,
  deleteFavorites: (symbol: string) => `/favorites/symbol/${symbol}`,
  getAllSymbols: () => `/stocks/all/symbolAndNames`,
  getAllSectors: () => `/sectors/all/info`,
  getRedditList: () => `/redittStocks/list/5`,
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

  deleteFavorites(symbol: string): Observable<any> {
    return this.httpClient
      .delete(routes.deleteFavorites(symbol), {
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

  closePosition(data: any): Observable<any> {
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

  updatePosition(data: any): Observable<any> {
    const dataList = {
      list: [data],
    };
    return this.httpClient
      .post(routes.addOpenPositions(), dataList, {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  addOpenPosition(data: any): Observable<any> {
    const dataList = {
      list: [data],
    };
    return this.httpClient
      .post(routes.addOpenPositions(), dataList, {
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

  getBeatNasdaq(): Observable<any> {
    return this.httpClient
      .get(routes.beatNasdaq(), {
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

  getIndexWeeklyGains(): Observable<any> {
    return this.httpClient
      .get(routes.indexWeeklyGains(), {
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

  getRedditStocks(): Observable<any> {
    return this.httpClient
      .get(routes.getRedditList(), {
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

  // getIndexSummary(): Observable<any> {
  //   debugger;
  //   return this.httpClient
  //     .get(routes.indexSummary(), {
  //       withCredentials: true,
  //     })
  //     .pipe(
  //       map((body: any) => {
  //         debugger;
  //         return body;
  //       }),
  //       catchError((err) => {
  //         return throwError(err);
  //       })
  //     );
  // }

  getIndexSummary(): Observable<any> {
    return this.httpClient
      .get(routes.indexSummary(), {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getTopIndustry(): Observable<any> {
    return this.httpClient
      .get(routes.topIndustry(), {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
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

  getFavorites(): Observable<any> {
    return this.httpClient
      .get(routes.favorites(), {
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

  getAllSymbols(): Observable<any> {
    return this.httpClient
      .get(routes.getAllSymbols(), {
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

  getAllSectors(): Observable<any> {
    return this.httpClient
      .get(routes.getAllSectors(), {
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
