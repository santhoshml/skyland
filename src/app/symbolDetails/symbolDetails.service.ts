import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SymbolDetailsResp, TagDetails } from './symbolDetails.component';

const routes = {
  listDetails: (symbol : string) => `/symbol/${symbol}/details`,
  tagDetails: () => `/data/tags`,
};

@Injectable({
  providedIn: 'root',
})
export class SymbolDetailsService {
  constructor(private httpClient: HttpClient) {}

  getListDetails(symbol: string): Observable<SymbolDetailsResp | string> {
    return this.httpClient.get(routes.listDetails(symbol)).pipe(
      map((body: SymbolDetailsResp) => body),
      catchError(() => of('Error, could not GET list details :-('))
    );
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
