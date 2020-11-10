import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SymbolDetailsService } from './symbolDetails.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {NgbModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Credentials, CredentialsService } from './../auth/credentials.service';

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

  typesMap = [
    {
      displayTitle : 'Price/Volume',
      tags: ['PRICE', 'PRICE_GAP', 'PRICE_GAP_DIR', 'AFTER_PULLBACK', 'NEAR_ROUND_NUMBER', 'ILLIQUID_STOCKS', 'WEEK_52', 'VOLUME']
    }
  ];
  
  constructor(private symbolDetailsService: SymbolDetailsService
    , private router: Router
    , private route: ActivatedRoute
    , private credentialsService: CredentialsService
    , private modalService: NgbModal) {}

  ngOnInit() {
    // get tag categories
    this.symbolDetailsService.getTagCategories().subscribe((data: TagCategories[])=>{
      console.log(`TagCategories data : ${JSON.stringify(data)} `);
      this.tagCategories = data;
      this.priceVolCategoryArr = data[0].tags;
      this.classificationCategoryArr = data[1].tags;
      this.technicalCategoryArr = data[2].tags;
    });

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
      this.activeSymbol = symbol;
      console.log(`In symbolDetails, userId:${userId}, symbol:${symbol}`);

      this.symbolDetailsResp$ = this.symbolDetailsService.getListDetails(symbol).pipe(
        map((body: any, headers: any)=> {
          console.log('symbolDetailsResp:'+JSON.stringify(body));
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

      // set Favorite flag
      this.isFavorite = this.symbolDetailsService.isFavorite(this.activeSymbol);

      // get notes
      this.symbolDetailsService.getUserNotes(this.activeSymbol).subscribe(data=>{
        console.log(`userNotes : ${JSON.stringify(data)}`);
        this.userNotes = data.notes;
      });

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

   // load tags from userModelProfile
   this.userModelTags = this.credentialsService.userProfileModel.selected_params;
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
      console.log(`userNotes: ${this.userNotes}`);
      this.symbolDetailsService.saveUserNotes(this.activeSymbol, this.userNotes).subscribe();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
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
    this.isFavorite=true;
    this.symbolDetailsService.addToFavorites(this.activeSymbol).subscribe();
  }

  removeFromFavorites(){
    this.isFavorite=false;
    this.symbolDetailsService.removeFromFavorites(this.activeSymbol).subscribe();
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
      details: false,
      container_id: 'tradingview_73abe'
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getArray(str:string){
    let sortedArr = JSON.parse(str).sort((a:string, b:string)=> a.length - b.length);
    // console.log(`sortedArr : ${JSON.stringify(sortedArr)}`);
    return sortedArr;
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
    for(let tag of this.priceVolCategoryArr){
      if(tag.toLowerCase() == val.toLowerCase()){
        return true;
      }
    }
    return false;
  }

  isExistsInClassification(val:string): boolean {
    for(let tag of this.classificationCategoryArr){
      if(tag.toLowerCase() == val.toLowerCase()){
        return true;
      }
    }
    return false;
  }

  isExistsInTechnical(val:string): boolean {
    for(let tag of this.technicalCategoryArr){
      if(tag.toLowerCase() == val.toLowerCase()){
        return true;
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
}
