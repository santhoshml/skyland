import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SymbolDetailsResp, TagDetails } from './symbolDetails.component';
import { CredentialsService } from '@app/auth';

const routes = {
  listDetails: (symbol : string) => `/symbol/${symbol}/details`,
  tagDetails: () => `/data/tags`,
  addToFavorites: (symbol : string) => `/favorites/symbol/${symbol}`,
  userNotes: (symbol : string) => `/userNotes/symbol/${symbol}`
};

@Injectable({
  providedIn: 'root',
})
export class SymbolDetailsService {
  constructor(private httpClient: HttpClient,
    private credentialsService : CredentialsService) {}

  getListDetails(symbol: string): Observable<SymbolDetailsResp | string> {
    return this.httpClient.get(routes.listDetails(symbol)).pipe(
      map((body: SymbolDetailsResp) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
  }

  addToFavorites(symbol: string) : Observable<any> {
    // add to localdb
    let favArr:string[] = this.credentialsService.userFavorites;
    favArr.push(symbol);
    this.credentialsService.setFavorites(favArr);

    // update the backend
    return this.httpClient.post(routes.addToFavorites(symbol), {}).pipe(
      map((body: any) => body),
      catchError((err:any) => {
        console.log(`Error while adding to favorites, ${JSON.stringify(err)}`);
        return throwError('Error, could not POST to favorites :-(');
      })
    );
  }

  removeFromFavorites(symbol: string) : Observable<any> {
    // add to localdb
    let updFavList = [];
    let favArr:string[] = this.credentialsService.userFavorites;
    for(let fSym of favArr){
      if(fSym.toLowerCase() != symbol.toLowerCase()){
        updFavList.push(fSym);
      }
    }
    this.credentialsService.setFavorites(updFavList);

    // update the backend
    return this.httpClient.delete(routes.addToFavorites(symbol), {}).pipe(
      map((body: any) => body),
      catchError((err:any) => {
        console.log(`Error while removing from favorites, ${JSON.stringify(err)}`);
        return throwError('Error, could not DELETE from favorites :-(');
      })
    );
  }

  saveUserNotes(symbol:string, notes:string): Observable<any> {
    // add to localdb
    this.credentialsService.setUserNotes(notes);

    let headers = {
      contentType: 'application/json'
    };

    // update the backend
    return this.httpClient.post(routes.userNotes(symbol), 
    {
      notes : notes
    }, {
      headers: headers
    }).pipe(
      map((body: any) => body),
      catchError((err:any) => {
        console.log(`Error while adding to userNotes, ${JSON.stringify(err)}`);
        return throwError('Error, could not POST to userNotes :-(');
      })
    );
  }

  getUserNotes(symbol:string): Observable<any> {
    // update the backend
    return this.httpClient.get(routes.userNotes(symbol)).pipe(
      map((body: any) => {
        // add to localdb
        this.credentialsService.setUserNotes(body.notes);
        return body;
      }),
      catchError((err:any) => {
        console.log(`Error while adding to userNotes, ${JSON.stringify(err)}`);
        return throwError('Error, could not POST to userNotes :-(');
      })
    );
  }

  isFavorite(symbol : string) : boolean {
    let favArr:string[] = this.credentialsService.userFavorites;
    for(let fSym of favArr){
      if(fSym.toLowerCase() == symbol.toLowerCase()){
        return true;
      }
    }
    return false;
  }

  getTagDetails(){
    return this.httpClient.get(routes.tagDetails()).pipe(
      map((body: Map<string, TagDetails[]>) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }

  loadTradingViewScript(containerId: string, widgetOptions:any, widgetType:string){
    const container: HTMLElement = document.getElementById(containerId);
    if(container){
      const script = document.createElement('script');
      script.innerHTML = JSON.stringify(widgetOptions);
      script.src = `https://s3.tradingview.com/external-embedding/${widgetType}.js`
      script.async = true;
      script.defer = true;
  
      // replace the widget node
      if(container.childElementCount === 1){
        container.appendChild(script);
      } else {
        container.replaceChild(script, container.childNodes[0]);
      }
    }    
  }

}
