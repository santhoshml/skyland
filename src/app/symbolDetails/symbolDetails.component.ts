import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SymbolDetailsService } from './symbolDetails.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

declare const TradingView: any;

export interface SymbolDetailsResp {
  status: string;
  data: SymbolDetails;
}

export interface SymbolDetails {
  id: number;
  user_id: number;
  date: string;
  symbol: string;
  gain_flag: number;
  confidence: string;
  price: string;
  sector: string;
  company_name: string;
  tags: string;
  accuracy: number;
}

export interface TagDetails {
  key: string;
  display : string;
  type: string;
  value: number;
  link: string;
}

@Component({
  selector: 'app-symbolDetails',
  templateUrl: './symbolDetails.component.html',
  styleUrls: ['./symbolDetails.component.scss'],
})
export class SymbolDetailsComponent implements OnInit {
  version: string | null = environment.version;
  isLoading = false;
  symbolDetailsResp$: Observable<SymbolDetailsResp | string>;
  private sub: any;
  tagDetailsMap: Map<string, TagDetails[]> = new Map<string, TagDetails[]>();
  tagDetailsArr: TagDetails[] = [];


  
  constructor(private symbolDetailsService: SymbolDetailsService
    , private router: Router
    , private route: ActivatedRoute) {}

  ngOnInit() {
    // get tag details
    this.symbolDetailsService.getTagDetails().subscribe((data: Map<string, TagDetails[]>)=>{
      this.tagDetailsMap = data;
      for (const [key, value] of Object.entries(this.tagDetailsMap)) { 
        this.tagDetailsArr = this.tagDetailsArr.concat(value)
      }
    });

    this.sub = this.route.params.subscribe(params => {
      console.log(`params : ${JSON.stringify(params)}`);
      let userId = 2;
      let symbol = params['symbol'];
      console.log(`In symbolDetails, userId:${userId}, symbol:${symbol}`);
      this.symbolDetailsResp$ = this.symbolDetailsService.getListDetails(symbol).pipe(
        map((body: any, headers: any)=> {
          console.log(body);
          if(!body.symbol){
            this.router.navigate(['/pageNotFound'], { replaceUrl: true });
          } else {
            return body;
          }
        }),
        catchError((err) => {
          if(err.status === 401){
            this.router.navigate(['/login', {errMsg: 'Session expired. Login please.'}], { replaceUrl: true });
          } else {
            return of()
          }
        })
      );

      // init InfoWidget
      let symbolInfoWidgetOptions = {
        "symbol": symbol,
        "width": "100%",
        "locale": "en",
        "colorTheme": "light",
        "isTransparent": true
      };
      this.symbolDetailsService.loadTradingViewScript('symbolInfoWidget', symbolInfoWidgetOptions, 'embed-widget-symbol-info');

      // load chart
      this.loadChart(symbol);
   })
  }

  loadChart(symbol:string) {
    console.log(`loading chart for ${symbol}`);
    new TradingView.widget({
      symbol: symbol,
      width: '100%',
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: false,
      save_image: false,
      details: true,
      container_id: 'tradingview_73abe'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getArray(str:string){
    return JSON.parse(str);
  }

  getTagDisplayText(str:string){
    let ele:TagDetails = this.tagDetailsArr.find((element: TagDetails)=> element.key === str);
    return ele ? ele.display: str;
  }
  
  gotoTagLink(str:string){
    let ele:TagDetails = this.tagDetailsArr.find((element: TagDetails)=> element.key === str);
    let retVal = ele ? ele.link: '#';
    window.open(retVal, "_blank");
  }
}
