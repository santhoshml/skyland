import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  topStocks: () => `/stocks/top`,
  yourBest: ()=>`/predictions/2/addLimit/1`
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

  getTopStocks(): Observable<any> {
    return this.httpClient.get(routes.topStocks(), 
    {
      withCredentials: true
    }).pipe(
      map((body: any) => body),
      catchError((err) => {
        console.log(`err: ${JSON.stringify(err)}`);
        return throwError(err);
      })
    );
  }

  getYourBestStocks(): Observable<any> {
    return this.httpClient.get(routes.yourBest(), 
    {
      withCredentials: true
    }).pipe(
      map((body: any) => body),
      catchError((err) => {
        console.log(`err: ${JSON.stringify(err)}`);
        return throwError(err);
      })
    );
  }
}
