import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { TopPicksService } from './topPicks.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService, CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-listCards',
  templateUrl: './topPicks.component.html',
  styleUrls: ['./topPicks.component.scss'],
})
export class TopPicksComponent implements OnInit {
  version: string | null = environment.version;
  isLoading = false;
  userProfile$: Observable<any>;
  topStocks$: Observable<any>;
  yourBestStocks$: Observable<any>;
  myOpenPositions$: Observable<any>;
  myClosePositions$: Observable<any>;
  hasConfidenceScore = false;
  newOpenPositionSymbol:string;
  openPositions:any = [];

  openPositionsForm!: FormGroup;
  showOpenPositionSuccess=false;
  sellPrice:string;
  sellDate:string;
  idToShow = 0;

  constructor(
    private service: TopPicksService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'listCards-init',
      'topPicks',
      'init',
      'topPicks',
      1,
      this.credentialsService.credentials.id
    );

    // setup the Add new positions form
    this.initOpenPositionsForm();

    // default close position date
    let todayDate = moment().format("MM/DD/YYYY");
    this.sellDate = todayDate;

    // set user profile
    this.userProfile$ = this.authenticationService.getUserModelProfile().pipe(
      map((body) => {
        this.credentialsService.setUserProfile(body);
        return body;
      })
    );

    this.topStocks$ = this.service.getTopStocks().pipe(
      map((body) => {
        // console.log(`topStocks : ${JSON.stringify(body)}`);
        if (body && body.length > 0 && body[0].confidence) {
          this.hasConfidenceScore = true;
        }
        // console.log(`this.hasConfidenceScore : ${this.hasConfidenceScore}`);
        return body;
      })
    );

    this.yourBestStocks$ = this.service.getYourBestStocks().pipe(
      map((body) => {
        // console.log(`yourBestStocks: ${JSON.stringify(body)}`);
        if (body.list && body.list.list) {
          return body.list.list;
        }
      })
    );

    this.readOpenPositions();
    this.readClosedPositions();
  }

  private initOpenPositionsForm() {
    let todayDate = moment().format("MM/DD/YYYY");
    this.openPositionsForm = this.formBuilder.group({
      symbol: ['', Validators.required],
      buy_price: ['', Validators.required],
      buy_date: [todayDate, Validators.required],
    });
  }

  thumbsUp(symbol: string) {
    // console.log(`thumbsup for ${symbol}`);
  }

  thumbsDown(symbol: string) {
    // console.log(`thumbsdown for ${symbol}`);
  }

  isFavorite(symbol: string) {
    let favList = this.credentialsService.userFavorites;
    if (favList && favList.length > 0) {
      for (let fav of favList) {
        if (symbol.toUpperCase() == fav.toUpperCase()) {
          return true;
        }
      }
    }
    return false;
  }

  addToFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'topPicks',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.credentials.id
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((data)=>{
      this.readOpenPositions();
    });
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'topPicks',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      0,
      this.credentialsService.credentials.id
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe();
  }

  addOpenPositions(){
    let formvalue = this.openPositionsForm.value;
    // console.log(`formvalue: ${JSON.stringify(formvalue)}`);
    formvalue.symbol = formvalue.symbol.toUpperCase();
    formvalue.buy_date = moment(formvalue.buy_date, "MM/DD/YYYY").format("YYYY-MM-DD");
    this.newOpenPositionSymbol = formvalue.symbol;
    this.service.addOpenPosition(formvalue).subscribe(
      (data)=>{
        let todayDate = moment().format("MM/DD/YYYY");
        // console.log(`In addOpenPositions: ${JSON.stringify(data)}`);
        this.openPositionsForm.reset();
        this.openPositionsForm.markAsPristine();
        this.showOpenPositionSuccess=true;
        this.openPositionsForm.patchValue({
          buy_date: todayDate
        });
        this.readOpenPositions();
    });
  }

  closeOpenPositionAlert(){
    this.showOpenPositionSuccess=false;
    this.newOpenPositionSymbol = null;
  }

  getDataTargetValue(id:number){
    return `#collapseExample${id}`
  }
  
  closePosition(id: number){
    // console.log(`In closePosition, id:${id}`);
    let closePositionData = {
      id: id,
      sellPrice: this.sellPrice,      
      sellDate: moment(this.sellDate, "MM/DD/YYYY").format("YYYY-MM-DD")
    };
    this.service.closePosition(closePositionData).subscribe(
      (data)=>{
        this.readOpenPositions();
        this.readClosedPositions();

        let todayDate = moment().format("MM/DD/YYYY");
        this.sellDate = todayDate;    
    });
  }

  readOpenPositions(){    
    this.myOpenPositions$ = this.service.getOpenPositions().pipe(
      map((body)=>{
        // console.log(`my open positions : ${JSON.stringify(body)}`);
        this.openPositions = body;
        return body;
      })
    );
  }

  readClosedPositions(){
    this.myClosePositions$ = this.service.getClosePositions().pipe(
      map((body)=>{
        // console.log(`my close positions : ${JSON.stringify(body)}`);
        return body;
      })
    );
  }

  getClosePrice(event:any){
    let symbol = event.target.value.toUpperCase();
    // console.log(`symbol: ${symbol}`);
    this.service.getPriceObject(symbol).subscribe(
      (data)=>{
        // console.log(`In getClosePrice, data:${JSON.stringify(data)}`);
        this.openPositionsForm.patchValue({
          buy_price: data.close,
          symbol: symbol
        });
      }
    );
  }

  enableClosePositionFlag(id:number) {
    // console.log(`start enableClosePositionFlag, id:${id}`);
    if(this.idToShow === id){
      this.idToShow = 0;
    } else {
      this.idToShow = id;
      let openPosition = this.getOpenPositionById(id);
      // console.log(`openPosition: ${JSON.stringify(openPosition)}`);
      this.sellPrice = openPosition.close; 
    }
  }

  getOpenPositionById(id:number) {
    return this.openPositions.length && this.openPositions.find(ele => ele.id === id);
  }

  deleteOpenPosition(id:number) {
    // console.log(`In deleteOpenPosition, id: ${id}`);
    this.service.deleteOpenPosition(id).subscribe((data)=>{
      this.readOpenPositions();
    })
  }
}