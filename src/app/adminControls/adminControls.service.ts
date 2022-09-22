import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  allUsers: () => `/allUsers`,
  disableUser: () => '/user/disable',
  enableUser: () => '/user/enable',
  config: () => '/config',
  twelveData: () => `/data/updateTwelveData`,
  publishTodayData: () => `/predictions/truncate`,
  uploadIndustryFile: () => `/subSector/file_upload`,
  uploadRedditFile: () => `/symbols/refreshReditt`,
  topStocks: (symbol) => `/stocks/top/${symbol}`,
  addNewSymbolToAllSymbols: () => `/symbol/new`,
  dailyEmailToAll: () => `/recommendations/all`,
  noPortfolioToAll: () => `/marketing/reminder/noPortfolio`,
  industryPerf: () => `/industry/performance`,
  earningsData: () => `/earnings/update`,
  commSummary: () => `/communication/summary`,
  marketingEmailToUser: (templateName, email) => `/communication/marketing/templateName/${templateName}/email/${email}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminControlsService {
  getCommSummary(): Observable<any> {
    return this.httpClient.get(routes.commSummary()).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET comm summary :-('))
    );
  }

  updateEarningsData(data: any) {
    return this.httpClient
      .post(routes.earningsData(), data, {
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

  updateIndustryPerfData(data: any) {
    return this.httpClient
      .post(routes.industryPerf(), data, {
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

  sendNoPortfolioData(data: any) {
    return this.httpClient
      .post(routes.noPortfolioToAll(), data, {
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

  sendDailyEmailData(data: any) {
    return this.httpClient
      .post(routes.dailyEmailToAll(), data, {
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

  updateConfigValue(data: any) {
    return this.httpClient
      .post(routes.config(), data, {
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

  addSymbolToTopStocks(symbol: string) {
    return this.httpClient
      .put(routes.topStocks(symbol), null, {
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

  addNewSymbolToAllSymbols(data: any) {
    return this.httpClient
      .post(routes.addNewSymbolToAllSymbols(), data, {
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

  updateTwelveData(data: any) {
    return this.httpClient
      .post(routes.twelveData(), data, {
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

  publishTodayData(data: any) {
    return this.httpClient
      .post(routes.publishTodayData(), data, {
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

  uploadIndustryFile(data: any) {
    return this.httpClient
      .post(routes.uploadIndustryFile(), data, {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  uploadRedditFile(data: any) {
    return this.httpClient
      .post(routes.uploadRedditFile(), data, {
        withCredentials: true,
      })
      .pipe(
        map((body: any) => body),
        catchError((err) => {
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

  sendMarketingEmailToUser(data: any) {
    return this.httpClient
      .post(routes.marketingEmailToUser(data.templateName, data.email), null, {
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
