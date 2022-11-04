import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  SymbolDetailsResp,
  TagDetails,
  TagCategories,
  SentimentResp,
  AnalystReccomendationResp,
  ExchangeResp,
} from './symbolDetails.component';
import { CredentialsService } from '@app/auth';

const routes = {
  listDetails: (symbol: string) => `/symbol/${symbol}/details`,
  tagDetails: () => `/data/tags`,
  addToFavorites: (symbol: string) => `/favorites/symbol/${symbol}`,
  userNotes: (symbol: string) => `/userNotes/symbol/${symbol}`,
  tagCategories: () => `/data/tagCategories`,
  analystReccomendations: (symbol: string) => `/analystReccomendation/symbol/${symbol}`,
  sentimentData: (symbol: string) => `/sentiment/symbol/${symbol}`,
  exchangeData: (symbol: string) => `/exchange/symbol/${symbol}`,
  symbolIndustryDetails: (symbol: string) => `/stocks/symbol/${symbol}/industryStats`,
  trendingDetails: (symbol: string) => `/trend/details/symbol/${symbol}`,
  symbolEvaluation: (symbol: string) => `/symbol/${symbol}/proscons`,
  earningsList: (symbol: string) => `/earnings/symbol/${symbol}`,
  adviceData: (symbol: string) => `/profileAdvice/symbol/${symbol}`,
};

export interface ITrendingDetails {
  dailyTrendline: string;
  monthlyTrendline: string;
  quaterlyTrendline: string;
  todaysPriceBehaviour: string;
  trendIndicators: string;
  trendStrength: string;
  yearlyTrendline: string;
  startNewPositionCandle: number;
}

@Injectable({
  providedIn: 'root',
})
export class SymbolDetailsService {
  activeSymbol = new Subject<string>();
  enableLoginPopup = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private credentialsService: CredentialsService) {}

  getAdviceData(symbol: string): Observable<any> {
    return this.httpClient.get(routes.adviceData(symbol)).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET advice details :-('))
    );
  }

  getEarnings(symbol: string): Observable<any> {
    return this.httpClient.get(routes.earningsList(symbol)).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET earnings details :-('))
    );
  }

  getSymbolEvaluation(symbol: string): Observable<ITrendingDetails | string> {
    return this.httpClient.get(routes.symbolEvaluation(symbol)).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }

  getSymbolIndustryDetails(symbol: string): Observable<any> {
    return this.httpClient.get(routes.symbolIndustryDetails(symbol)).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET exchange details :-('))
    );
  }

  getExchangeData(symbol: string): Observable<ExchangeResp | string> {
    return this.httpClient.get(routes.exchangeData(symbol)).pipe(
      map((body: ExchangeResp) => body),
      catchError(() => of('Error, could not GET exchange details :-('))
    );
  }

  getSentimentData(symbol: string): Observable<SentimentResp | string> {
    return this.httpClient.get(routes.sentimentData(symbol)).pipe(
      map((body: SentimentResp) => body),
      catchError(() => of('Error, could not GET sentiment details :-('))
    );
  }

  getAnalystReccomendationData(symbol: string): Observable<AnalystReccomendationResp | string> {
    return this.httpClient.get(routes.analystReccomendations(symbol)).pipe(
      map((body: AnalystReccomendationResp) => body),
      catchError(() => of('Error, could not GET sentiment details :-('))
    );
  }

  getTrendingDetails(symbol: string): Observable<ITrendingDetails | string> {
    return this.httpClient.get(routes.trendingDetails(symbol)).pipe(
      map((body: ITrendingDetails) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }

  getTagCategories(): Observable<TagCategories[] | string> {
    return this.httpClient.get(routes.tagCategories()).pipe(
      map((body: TagCategories[]) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }

  getListDetails(symbol: string): Observable<SymbolDetailsResp | string> {
    return this.httpClient.get(routes.listDetails(symbol)).pipe(
      map((body: SymbolDetailsResp) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }

  addToFavorites(symbol: string): Observable<any> {
    // add to localdb
    if (this.credentialsService.credentials) {
      let favArr: string[] = this.credentialsService.userFavorites;
      favArr.push(symbol);
      this.credentialsService.setFavorites(favArr);

      // update the backend
      return this.httpClient.post(routes.addToFavorites(symbol), {}).pipe(
        map((body: any) => body),
        catchError((err: any) => {
          // console.log(`Error while adding to favorites, ${JSON.stringify(err)}`);
          return throwError('Error, could not POST to favorites :-(');
        })
      );
    } else {
      this.enableLoginPopup.next(true);
      return of({});
    }
  }

  removeFromFavorites(symbol: string): Observable<any> {
    // add to localdb
    let updFavList = [];
    let favArr: string[] = this.credentialsService.userFavorites;
    for (let fSym of favArr) {
      if (fSym.toLowerCase() != symbol.toLowerCase()) {
        updFavList.push(fSym);
      }
    }
    this.credentialsService.setFavorites(updFavList);

    // update the backend
    return this.httpClient.delete(routes.addToFavorites(symbol), {}).pipe(
      map((body: any) => body),
      catchError((err: any) => {
        // console.log(`Error while removing from favorites, ${JSON.stringify(err)}`);
        return throwError('Error, could not DELETE from favorites :-(');
      })
    );
  }

  saveUserNotes(symbol: string, notes: string): Observable<any> {
    // add to localdb
    this.credentialsService.setUserNotes(notes);

    let headers = {
      contentType: 'application/json',
    };

    // update the backend
    return this.httpClient
      .post(
        routes.userNotes(symbol),
        {
          notes: notes,
        },
        {
          headers: headers,
        }
      )
      .pipe(
        map((body: any) => body),
        catchError((err: any) => {
          // console.log(`Error while adding to userNotes, ${JSON.stringify(err)}`);
          return throwError('Error, could not POST to userNotes :-(');
        })
      );
  }

  getUserNotes(symbol: string): Observable<any> {
    // update the backend
    return this.httpClient.get(routes.userNotes(symbol)).pipe(
      map((body: any) => {
        // add to localdb
        this.credentialsService.setUserNotes(body.notes);
        return body;
      }),
      catchError((err: any) => {
        // console.log(`Error while adding to userNotes, ${JSON.stringify(err)}`);
        return throwError('Error, could not POST to userNotes :-(');
      })
    );
  }

  isFavorite(symbol: string): boolean {
    let favArr: string[] = this.credentialsService.userFavorites;
    for (let fSym of favArr) {
      if (fSym.toLowerCase() == symbol.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  getTagDetails() {
    return this.httpClient.get(routes.tagDetails()).pipe(
      map((body: Map<string, TagDetails[]>) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }

  loadTradingViewScript(containerId: string, widgetType: string, widgetOptions: any) {
    const container: HTMLElement = document.getElementById(containerId);
    container.innerHTML = '';
    if (container) {
      const script = document.createElement('script');
      script.innerHTML = JSON.stringify(widgetOptions);
      script.src = `https://s3.tradingview.com/external-embedding/${widgetType}.js`;
      script.async = true;
      script.defer = true;

      container.appendChild(script);
      // replace the widget node
      // if(container.childElementCount === 1){
      //   console.log(`appending the child node`);
      //   container.appendChild(script);
      // } else {
      //     // container.firstChild.remove();
      //     console.log(`replacing the child node`);
      //     console.log(container.childNodes[0]);
      //   container.replaceChild(script, container.childNodes[0]);
      // }
    }
  }
}
