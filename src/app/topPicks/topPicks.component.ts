import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { TopPicksService } from './topPicks.service';
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
  selector: 'app-listCards',
  templateUrl: './topPicks.component.html',
  styleUrls: ['./topPicks.component.scss'],
})
export class TopPicksComponent implements OnInit {
  modalReference: NgbModalRef;
  version: string | null = environment.version;
  isLoading = false;
  // userProfile$: Observable<any>;
  topStocks$: Observable<any>;
  redditStocks$: Observable<any>;
  yourBestStocks$: Observable<any>;
  favorites$: Observable<any>;
  watchlist$: Observable<any>;
  myOpenPositions$: Observable<any>;
  myClosePositions$: Observable<any>;
  indexSummary$: Observable<any>;
  indexWeeklyGains$: Observable<any>;
  topIndustry$: Observable<any>;
  beatNasdaq$: Observable<any>;
  hasConfidenceScore = false;
  newOpenPositionSymbol: string;
  openPositions: any = [];
  displayNotificationInTopStocks = false;
  topStocksNotificationMsg: string;
  displayNotificationInFavorites = false;
  isTopIndustry = false;
  favoritesSymbol: string;

  sellPrice: string;
  sellDate: string;
  buyPrice: number;
  qty: number;

  // searchbar
  keyword = 'name';
  allSymbolData = [];
  data = [];

  qqqWklyGain = 0;
  spyWklyGain = 0;

  constructor(
    private service: TopPicksService,
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
      'topPicks-init',
      'view',
      'init',
      'topPicks',
      1,
      this.credentialsService.credentials?.email
    );

    // default close position date
    let todayDate = moment().format('MM/DD/YYYY');
    this.sellDate = todayDate;

    this.readFavorites();

    this.topStocks$ = this.service.getTopStocks().pipe(
      map((body) => {
        return body;
      })
    );

    this.redditStocks$ = this.service.getRedditStocks().pipe(
      map((body) => {
        return body;
      })
    );

    this.beatNasdaq$ = this.service.getBeatNasdaq().pipe(
      map((body) => {
        if (body && body.length > 0) {
          return body.slice(0, 5);
        }
      })
    );

    this.indexSummary$ = this.service.getIndexSummary().pipe(
      map((body) => {
        return body;
      })
    );

    this.topIndustry$ = this.service.getTopIndustry().pipe(
      map((body) => {
        this.isTopIndustry = true;
        return body;
      })
    );

    this.service.getIndexWeeklyGains().subscribe((list) => {
      if (list && list.length > 0) {
        for (let rec of list) {
          if (rec.name === 'QQQ') {
            this.qqqWklyGain = parseFloat(rec.gain_percent);
          } else if (rec.name === 'SPY') {
            this.spyWklyGain = parseFloat(rec.gain_percent);
          }
        }
      }
    });

    this.service.getAllSymbols().subscribe((data) => {
      this.allSymbolData = data;
      this.data = data.slice(0, 15);
    });
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    // console.log(`addToFavorites : ${symbol}`);
    this.googleAnalyticsService.eventEmitter(
      'topPicks',
      'click',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.userEmail
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((body) => {
      // console.log(`Done addToFavorites`);
      this.readFavorites();
    });
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'topPicks',
      'click',
      'removeFromFavorites',
      'removeFromFavorites',
      0,
      this.credentialsService.userEmail
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe();
  }

  getDataTargetValue(id: number) {
    return `#collapseExample${id}`;
  }

  readFavorites() {
    this.service
      .getFavorites()
      .pipe(
        map((body) => {
          // console.log(`yourBestStocks: ${JSON.stringify(body)}`);
          if (body.list) {
            this.credentialsService.setFavorites(this.getSymbolArr(body.list));
            return body.list;
          }
        })
      )
      .subscribe();
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

  viewAllBetterPerformingStocks() {
    this.router.navigate(['/redditToppers'], { replaceUrl: true });
  }

  viewIndustryDetails(id: number) {
    this.router.navigate([`/subSectorDetails/${id}`], { replaceUrl: true });
  }

  gotoDetails(symbol) {
    this.router.navigate([`/symbolDetails/${symbol}`], { replaceUrl: true });
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    // console.log(`In onChangeSearch, ${JSON.stringify(val)}`);
    let filteredList = [];
    if (!val || val.length === 0 || !this.allSymbolData) {
      return [];
    } else {
      // console.log(`this.allSymbolData length : ${this.allSymbolData.length}`);
      let str = val.toLowerCase();
      // console.log(`ste:${str}`);
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
    // console.log(`In onFocused, ${JSON.stringify(e)}`);
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }
}
