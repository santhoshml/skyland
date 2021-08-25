import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { ListDetailsService } from './listDetails.service';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import pruned from 'pruned';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

export interface ListDetails {
  success: boolean;
  size: number;
  list: ListTable;
}

export interface ListTable {
  title: string;
  desc: string;
  list: ListRow[];
}

export interface ListRow {
  symbol: string;
  confidence: string;
  raw_confidence: number;
  companyName: string;
  sector: string;
  price: string;
  tags: string[];
  gain_flag: number;
}

@Component({
  selector: 'app-listDetails',
  templateUrl: './listDetails.component.html',
  styleUrls: ['./listDetails.component.scss'],
})
export class ListDetailsComponent implements OnInit {
  version: string | null = environment.version;
  listDetailsArr: ListDetails[];
  isLoading = false;
  listId: number;
  listDetails$: Observable<any>;
  private sub: any;
  userProfile: UserProfileModel;

  MIN_ROWS_TO_DISPLAY = 10;
  MAX_ROWS_TO_DISPLAY = 10000;
  hideViewMoreBtn = false;
  totalListCount = 0;
  currentTableCount = this.MIN_ROWS_TO_DISPLAY;

  constructor(
    private listDetailsService: ListDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'listDetails-init',
      'listDetails',
      'init',
      'listDetails',
      1,
      this.credentialsService.credentials.email
    );

    // this.listDetails$ = this.listDetailsService.getListDetails();
    this.sub = this.route.params.subscribe((params) => {
      // console.log(`params : ${JSON.stringify(params)}`);
      this.listId = +params['listId']; // (+) converts string 'listId' to a number

      // console.log(`this.listId : ${this.listId}`);

      // get the list from BE
      this.listDetails$ = this.listDetailsService.getListDetails(this.listId, this.MIN_ROWS_TO_DISPLAY).pipe(
        map((body: any, headers: any) => {
          return body;
        }),
        catchError((err) => {
          if (err.status === 401) {
            this.router.navigate(['/login', { errMsg: 'Session expired. Login please.' }], { replaceUrl: true });
          } else {
            return of();
          }
        })
      );
      this.listDetails$.subscribe((data) => {
        this.totalListCount = data.count;
      });
    });

    // set user profile
    this.userProfile = this.credentialsService.userProfileModel;
  }

  viewMoreFn() {
    this.currentTableCount = this.currentTableCount + this.MIN_ROWS_TO_DISPLAY;
    if (this.currentTableCount >= this.totalListCount) {
      this.hideViewMoreBtn = true;
    }
    this.listDetails$ = this.listDetailsService.getListDetails(this.listId, this.currentTableCount).pipe(
      map((body: any, headers: any) => {
        return body;
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['/login', { errMsg: 'Session expired. Login please.' }], { replaceUrl: true });
        } else {
          return of();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getSymbolDetails(listRow: ListRow) {
    // console.log(`navigate to SymbolDetails, ${JSON.stringify(listRow)}`);
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails-forwading',
      'symbolDetails',
      'forwading',
      'symbolDetails',
      1,
      this.credentialsService.credentials.email
    );
    this.router.navigate([`symbolDetails`, listRow.symbol], { replaceUrl: true });
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'listDetails',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe();
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'listDetails',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      0,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe();
  }
}
