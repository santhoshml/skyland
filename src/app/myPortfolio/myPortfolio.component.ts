import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { MyPortfolioService } from './myPortfolio.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import pruned from 'pruned';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-myPortfolio',
  templateUrl: './myPortfolio.component.html',
  styleUrls: ['./myPortfolio.component.scss'],
})
export class MyPortfolioComponent implements OnInit {
  @ViewChild('auto') auto;

  modalReference: NgbModalRef;
  version: string | null = environment.version;
  isLoading = false;
  userProfile$: Observable<any>;
  yourBestStocks$: Observable<any>;
  favorites$: Observable<any>;
  watchlist$: Observable<any>;
  myOpenPositions$: Observable<any>;
  myClosePositions$: Observable<any>;
  hasConfidenceScore = false;
  newOpenPositionSymbol: string;
  openPositions: any = [];
  displayNotificationInTopStocks = false;
  displayNotificationInFavorites = false;
  favoritesSymbol: string;

  openPositionsForm!: FormGroup;
  showOpenPositionSuccess = false;
  sellPrice: string;
  sellDate: string;
  buyPrice: number;
  qty: number;
  selectedPortfolioSymbol: any;

  // searchbar
  keyword = 'name';
  allSymbolData = [];
  data = [];

  constructor(
    private service: MyPortfolioService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'myPortfolio-init',
      'myPortfolio',
      'init',
      'myPortfolio',
      1,
      this.credentialsService.credentials.email
    );

    // setup the Add new positions form
    this.initOpenPositionsForm();

    // default close position date
    let todayDate = moment().format('MM/DD/YYYY');
    this.sellDate = todayDate;

    // set user profile
    this.userProfile$ = this.authenticationService.getUserModelProfile().pipe(
      map((body) => {
        this.credentialsService.setUserProfile(body);
        return body;
      })
    );

    this.service.getAllSymbols().subscribe((data) => {
      this.allSymbolData = data;
      this.data = data.slice(0, 15);
    });

    this.readFavorites();
    this.readOpenPositions();
    this.readClosedPositions();
  }

  private initOpenPositionsForm() {
    let todayDate = moment().format('MM/DD/YYYY');
    this.openPositionsForm = this.formBuilder.group({
      symbol: ['', Validators.required],
      buy_price: ['', Validators.required],
      qty: ['', Validators.required],
      buy_date: [todayDate],
    });
  }

  thumbsUp(symbol: string) {
    // console.log(`thumbsup for ${symbol}`);
  }

  thumbsDown(symbol: string) {
    // console.log(`thumbsdown for ${symbol}`);
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    console.log(`addToFavorites : ${symbol}`);
    this.googleAnalyticsService.eventEmitter(
      'myPortfolio',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((body) => {
      console.log(`Done addToFavorites`);
      this.readFavorites();
      this.displayNotificationInFavorites = true;
      this.favoritesSymbol = symbol;
    });
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'myPortfolio',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      0,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe();
  }

  addOpenPositions() {
    let formvalue = this.openPositionsForm.value;
    // console.log(`formvalue: ${JSON.stringify(formvalue)}`);
    formvalue.symbol = this.newOpenPositionSymbol.toUpperCase();
    formvalue.buy_date = moment(formvalue.buy_date, 'MM/DD/YYYY').format('YYYY-MM-DD');
    this.newOpenPositionSymbol = formvalue.symbol;
    this.service.addOpenPosition(formvalue).subscribe((data) => {
      let todayDate = moment().format('MM/DD/YYYY');
      // console.log(`In addOpenPositions: ${JSON.stringify(data)}`);
      this.openPositionsForm.reset();
      this.openPositionsForm.markAsPristine();
      this.showOpenPositionSuccess = true;
      this.openPositionsForm.patchValue({
        buy_date: todayDate,
      });
      this.readOpenPositions();
      this.auto.clear();
    });
  }

  closeOpenPositionAlert() {
    this.showOpenPositionSuccess = false;
    this.newOpenPositionSymbol = null;
  }

  getDataTargetValue(id: number) {
    return `#collapseExample${id}`;
  }

  closePosition(id: number) {
    // console.log(`In closePosition, id:${id}`);
    let closePositionData = {
      id: id,
      sellPrice: this.sellPrice,
      sellDate: moment(this.sellDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    };
    this.service.closePosition(closePositionData).subscribe((data) => {
      this.readOpenPositions();
      this.readClosedPositions();

      let todayDate = moment().format('MM/DD/YYYY');
      this.sellDate = todayDate;
      this.modalReference.close();
    });
  }

  updatePosition(id: number) {
    let updatePositionData = {
      buy_price: this.buyPrice,
      qty: this.qty,
      symbol: this.selectedPortfolioSymbol.symbol,
    };
    this.service.updatePosition(updatePositionData).subscribe((data) => {
      this.readOpenPositions();
      this.modalReference.close();
    });
  }

  readOpenPositions() {
    this.myOpenPositions$ = this.service.getOpenPositions().pipe(
      map((body) => {
        console.log(`my open positions : ${JSON.stringify(body)}`);
        this.openPositions = body;
        return body;
      })
    );
  }

  readFavorites() {
    this.favorites$ = this.service.getFavorites().pipe(
      map((body) => {
        // console.log(`yourBestStocks: ${JSON.stringify(body)}`);
        if (body.list) {
          this.credentialsService.setFavorites(this.getSymbolArr(body.list));
          return body.list;
        }
      })
    );
  }

  getSymbolArr(list: any) {
    let arr: string[] = [];
    if (list && list.length > 0) {
      for (let rec of list) {
        arr.push(rec.symbol);
      }
    }
    return arr;
  }

  readClosedPositions() {
    this.myClosePositions$ = this.service.getClosePositions().pipe(
      map((body) => {
        // console.log(`my close positions : ${JSON.stringify(body)}`);
        return body;
      })
    );
  }

  getClosePrice(event: any) {
    let symbol = event.target.value.toUpperCase();
    // console.log(`symbol: ${symbol}`);
    this.service.getPriceObject(symbol).subscribe((data) => {
      // console.log(`In getClosePrice, data:${JSON.stringify(data)}`);
      this.openPositionsForm.patchValue({
        buy_price: data.close,
        symbol: symbol,
      });
    });
  }

  enableClosePositionFlag(content: any, list: any) {
    this.selectedPortfolioSymbol = list;
    let openPosition = this.getOpenPositionById(list.id);
    this.sellPrice = openPosition.close;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'closePosition-modal-popup' });
  }

  updatePopupPosition(content: any, list: any) {
    this.selectedPortfolioSymbol = list;
    let openPosition = this.getOpenPositionById(list.id);
    this.buyPrice = 0;
    this.qty = 0;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'updatePosition-modal-popup' });
  }

  getOpenPositionById(id: number) {
    return this.openPositions.length && this.openPositions.find((ele) => ele.id === id);
  }

  deleteOpenPosition(id: number) {
    // console.log(`In deleteOpenPosition, id: ${id}`);
    this.service.deleteOpenPosition(id).subscribe((data) => {
      this.readOpenPositions();
    });
  }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  closeFavoritesAlert() {
    this.displayNotificationInFavorites = false;
    this.favoritesSymbol = null;
  }

  deleteFromFavorites(symbol: string) {
    // console.log(`In deleteOpenPosition, id: ${id}`);
    this.service.deleteFavorites(symbol).subscribe((data) => {
      this.readFavorites();
    });
  }

  viewAllUptrendingStocks() {
    this.router.navigate(['/uptrendingStocks'], { replaceUrl: true });
  }

  selectEvent(item) {
    // do something with selected item
    console.log(`In selectEvent, ${JSON.stringify(item)}`);
    if (item) {
      let symbol = item.id.toUpperCase();
      this.newOpenPositionSymbol = symbol;

      this.service.getPriceObject(symbol).subscribe((data) => {
        // console.log(`In getClosePrice, data:${JSON.stringify(data)}`);
        this.openPositionsForm.patchValue({
          buy_price: data.close,
          symbol: symbol,
        });
      });
    }
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(`In onChangeSearch, ${JSON.stringify(val)}`);
    let filteredList = [];
    if (!val || val.length === 0 || !this.allSymbolData) {
      return [];
    } else {
      console.log(`this.allSymbolData length : ${this.allSymbolData.length}`);
      let str = val.toLowerCase();
      console.log(`ste:${str}`);
      for (let ele of this.allSymbolData) {
        if (ele.name.toLowerCase().includes(str)) {
          filteredList.push(ele);
        }
        if (filteredList.length >= 15) {
          this.data = filteredList;
        }
      }
      this.data = filteredList;
    }
  }

  onFocused(e) {
    // do something when input is focused
    console.log(`In onFocused, ${JSON.stringify(e)}`);
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }
}
