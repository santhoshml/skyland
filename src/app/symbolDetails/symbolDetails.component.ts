import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SymbolDetailsService } from './symbolDetails.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {NgbModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

declare const TradingView: any;

export interface ExchangeResp {
  exchange: string;
}

export interface SentimentResp {
  sentiment: number;
  totalScores: number;
  positive: number;
  negative: number;
  minute: string;
  value: number;
}

export interface AnalystRatingRecord {
  name: string;
  value: number;
}

export interface AnalystReccomendationResp {
  data: AnalystRatingRecord[];
}

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
  gain_type: number;
}

export interface TagDetails {
  key: string;
  display : string;
  type: string;
  value: number;
  link: string;
}

export interface TagCategories {
  display_title: string;
  tags : string[];
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
  sentimentResp$: Observable<SentimentResp | string>;
  analystReccomendationResp$: Observable<AnalystRatingRecord[] | string>;
  analystReccomendationList: AnalystRatingRecord[];
  private sub: any;
  tagDetailsMap: Map<string, TagDetails[]> = new Map<string, TagDetails[]>();
  tagDetailsArr: TagDetails[] = [];
  userModelTags:string[];
  activeSymbol:string;
  isFavorite=false;
  closeResult: string;
  title = 'appBootstrap';
  userNotes:string;
  tagCategories: TagCategories[];
  priceVolCategoryArr:string[];
  classificationCategoryArr:string[];
  technicalCategoryArr:string[];
  userProfile: UserProfileModel;
  enableStockFeatures = false;
  completeSymbol:string=null;

  view: any[] = [270, 400];
  // options
  pieGradient: boolean = true;
  pieShowLegend: boolean = false;
  pieShowLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';//right
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#KKKKKK']
  };


  typesMap = [
    {
      displayTitle : 'Price/Volume',
      tags: ['PRICE', 'PRICE_GAP', 'PRICE_GAP_DIR', 'AFTER_PULLBACK', 'NEAR_ROUND_NUMBER', 'ILLIQUID_STOCKS', 'WEEK_52', 'VOLUME']
    }
  ];

  // dial guage
  public canvasWidth = 270
  public needleValue = 65
  public centralLabel = ''
  public name = 'Social Sentiment'
  public bottomLabel = '65'
  public options = {
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 1000,
      arcColors: ['rgb(255,99,71)', 'rgb(123,104,238)'],
      arcDelimiters: [50],
      rangeLabel: ['Bearish', 'Bullish'],
      needleStartValue: 50,
  };
  
  constructor(private symbolDetailsService: SymbolDetailsService
    , private router: Router
    , private route: ActivatedRoute
    , private credentialsService: CredentialsService
    , private modalService: NgbModal
    , private googleAnalyticsService: GoogleAnalyticsService) {}

  ngOnInit() {
    console.log(`I am in ngOnInit`);
    this.googleAnalyticsService.eventEmitter("symbolDetails-init", "symbolDetails", "init", "init", 1,this.credentialsService.credentials.id);

    // get tag categories
    this.symbolDetailsService.getTagCategories().subscribe((data: TagCategories[])=>{
      this.googleAnalyticsService.eventEmitter("symbolDetails-init", "symbolDetails", "init", "getTagCategories", 1,this.credentialsService.credentials.id);
      this.tagCategories = data;
      this.priceVolCategoryArr = data[0].tags;
      this.classificationCategoryArr = data[1].tags;
      this.technicalCategoryArr = data[2].tags;
    });

    // get tag details
    this.symbolDetailsService.getTagDetails().subscribe((data: Map<string, TagDetails[]>)=>{
      this.googleAnalyticsService.eventEmitter("symbolDetails-init", "symbolDetails", "init", "getTagDetails", 1,this.credentialsService.credentials.id);
      this.tagDetailsMap = data;
      for (const [key, value] of Object.entries(this.tagDetailsMap)) { 
        this.tagDetailsArr = this.tagDetailsArr.concat(value)
      }
    });

    this.sub = this.route.params.subscribe(params => {
      this.activeSymbol = params['symbol'].toUpperCase();
      this.completeSymbol=this.activeSymbol;

      //get exchange data
      this.symbolDetailsService.getExchangeData(this.activeSymbol).subscribe(data=>{
        this.googleAnalyticsService.eventEmitter("symbolDetails-init", "symbolDetails", "init", "getExchangeData", 1,this.credentialsService.credentials.id);
        let exchange=data['exchange'];
        if(exchange){
          this.completeSymbol=`${exchange}:${this.activeSymbol}`;
        }
      });

      this.symbolDetailsResp$ = this.symbolDetailsService.getListDetails(this.activeSymbol).pipe(
        map((body: any, headers: any)=> {
          this.googleAnalyticsService.eventEmitter("symbolDetails-init", "symbolDetails", "init", "getListDetails", 1,this.credentialsService.credentials.id);
          if(body.symbol){
            this.enableStockFeatures = true;
          }
          return body;
        }),
        catchError((err) => {
          if(err.status === 401){
            this.router.navigate(['/login', {errMsg: 'Session expired. Login please.'}], { replaceUrl: true });
          } else {
            return of()
          }
        })
      );

      // set Favorite flag
      this.isFavorite = this.symbolDetailsService.isFavorite(this.activeSymbol);

      // getSentiment data
      this.sentimentResp$ = this.symbolDetailsService.getSentimentData(this.activeSymbol);

      // AnalystReccomendation data
      this.analystReccomendationResp$ = this.symbolDetailsService.getAnalystReccomendationData(this.activeSymbol)
      .pipe(map((body:AnalystReccomendationResp)=>{
        if(body){
          this.analystReccomendationList = body.data;
          return body.data;  
        }
        return [];
      }))

      // get notes
      this.symbolDetailsService.getUserNotes(this.activeSymbol).subscribe(data=>{
        this.googleAnalyticsService.eventEmitter("symbolDetails-init", "symbolDetails", "init", "getUserNotes", 1,this.credentialsService.credentials.id);
        this.userNotes = data.notes;
      });

      // init InfoWidget
      let infoWidgetOptions = {
        "symbol": this.completeSymbol,
        "width": "100%",
        "locale": "en",
        "colorTheme": "light",
        "isTransparent": true
      };  
      this.symbolDetailsService.loadTradingViewScript('symbolInfoWidget', 'embed-widget-symbol-info', infoWidgetOptions);

      // load chart
      this.loadChart(this.completeSymbol);

      // technical info widget
      let technicalsInfoWIdget = {
        "interval": "1D",
        "width": 270,
        "isTransparent": true,
        "height": 510,
        "symbol": this.completeSymbol,
        "showIntervalTabs": true,
        "locale": "en",
        "colorTheme": "light"
      };
      this.symbolDetailsService.loadTradingViewScript('symbolTechnicalsWidget', 'embed-widget-technical-analysis', technicalsInfoWIdget);
   })

   // load tags from userModelProfile
   this.userModelTags = this.credentialsService.userProfileModel ? this.credentialsService.userProfileModel.selected_params : [];

    // set user profile
    this.userProfile=this.credentialsService.userProfileModel;
  }

  getAnalystReccomendationValue(name:string) {
    if(this.analystReccomendationList && this.analystReccomendationList.length>0){
      for(let ele of this.analystReccomendationList){
        if(ele.name.toUpperCase() == name.toUpperCase()){
          return ele.value;
        }
      }
    }
    return 0;
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.googleAnalyticsService.eventEmitter("symbolDetails", "modalService.open", "modalService-closed", result, 0,this.credentialsService.credentials.id);
      this.closeResult = `Closed with: ${result}`;
      this.symbolDetailsService.saveUserNotes(this.activeSymbol, this.userNotes).subscribe();
    }, (reason) => {
      this.googleAnalyticsService.eventEmitter("symbolDetails", "modalService.open", "modalService-closed", reason, 0,this.credentialsService.credentials.id);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  addToFavorites(){
    this.googleAnalyticsService.eventEmitter("symbolDetails", "favorites", "addToFavorites", "addToFavorites", 1,this.credentialsService.credentials.id);
    this.isFavorite=true;
    this.symbolDetailsService.addToFavorites(this.activeSymbol).subscribe();
  }

  removeFromFavorites(){
    this.googleAnalyticsService.eventEmitter("symbolDetails", "favorites", "removeFromFavorites", "removeFromFavorites", 0,this.credentialsService.credentials.id);
    this.isFavorite=false;
    this.symbolDetailsService.removeFromFavorites(this.activeSymbol).subscribe();
  }

  loadChart(symbol:string) {
    this.googleAnalyticsService.eventEmitter("symbolDetails", "chart", "loadChart", symbol, 1,this.credentialsService.credentials.id);
    new TradingView.widget({
      symbol: this.activeSymbol,
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
      details: false,
      container_id: 'tradingview_73abe'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getArray(str:string){
    if(str){
      let sortedArr = JSON.parse(str).sort((a:string, b:string)=> a.length - b.length);
      return sortedArr;
    }
    return [];

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

  isExistInUserProfile(tag:string) {
    if(this.userModelTags.find(str=> str === tag))
      return true;
    return false;
  }

  isExistsInPriceVol(val:string): boolean {
    if(this.priceVolCategoryArr){
      for(let tag of this.priceVolCategoryArr){
        if(tag.toLowerCase() == val.toLowerCase()){
          return true;
        }
      }  
    }
    return false;
  }

  isExistsInClassification(val:string): boolean {
    if(this.classificationCategoryArr){
      for(let tag of this.classificationCategoryArr){
        if(tag.toLowerCase() == val.toLowerCase()){
          return true;
        }
      }  
    }
    return false;
  }

  isExistsInTechnical(val:string): boolean {
    if(this.technicalCategoryArr){
      for(let tag of this.technicalCategoryArr){
        if(tag.toLowerCase() == val.toLowerCase()){
          return true;
        }
      }  
    }
    return false;
  }

  getClassForPills(tag:string): string {
    if(this.userModelTags.find(str=> str === tag)) {
      return 'badge badge-pill badge-primary';
    }
    return 'badge badge-pill badge-light';
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
