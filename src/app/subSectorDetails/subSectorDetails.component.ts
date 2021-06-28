import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SubSectorDetailsService } from './subSectorDetails.service';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import pruned from 'pruned';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';

export interface SubSectorDetailsTable {
  id: number;
  tag: string;
  title: string;
  change: string;
  perf_week: string;
  perf_month: string;
  perf_quart: string;
  perf_half: string;
  perf_year: string;
  perf_ytd: string;
  list: SubSectorDetailsRow[];
}

export interface SubSectorDetailsRow {
  symbol: string;
  companyName: string;
  close: number;
  volume: number;
  direction: number;
}

@Component({
  selector: 'app-subSectorDetails',
  templateUrl: './subSectorDetails.component.html',
  styleUrls: ['./subSectorDetails.component.scss'],
})
export class SubSectorDetailsComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  isLoading = false;
  subSectorDetailsArr$: Observable<any>;
  private sub: any;
  userProfile: UserProfileModel;
  change_map: Map<string, string> = new Map([
    ['day_change', '1-day'],
    ['one_month_change', '1-Month'],
    ['three_month_change', '3-Months'],
    ['one_year_change', '1-Year'],
    ['ytd_change', 'YTD'],
  ]);

  subSectorId = '';

  MIN_ROWS_TO_DISPLAY = 10;
  MAX_ROWS_TO_DISPLAY = 10000;
  hideViewMoreBtn = false;
  tableData: any = [];

  constructor(
    private subSectorDetailsService: SubSectorDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'subSectorDetails-init',
      'subSectorDetails',
      'init',
      'subSectorDetails',
      1,
      this.credentialsService.credentials.email
    );

    // this.listDetails$ = this.listDetailsService.getListDetails();
    this.sub = this.route.params.subscribe((params) => {
      // console.log(`params : ${JSON.stringify(params)}`);
      this.subSectorId = params['key']; // (+) converts string 'listId' to a number

      // console.log(`key : ${key}`);

      // get the list from BE
      this.subSectorDetailsArr$ = this.subSectorDetailsService
        .getSubSectorDetails(this.subSectorId, this.MIN_ROWS_TO_DISPLAY)
        .pipe(
          map((body: any, headers: any) => body),
          catchError((err) => {
            // console.log(`I am catchError`);
            if (err.status === 401) {
              this.router.navigate(['/login', { errMsg: 'Session expired. Login please.' }], { replaceUrl: true });
            } else {
              return of();
            }
          })
        );
    });

    // set user profile
    this.userProfile = this.credentialsService.userProfileModel;
  }

  tableValue(data) {
    this.tableData = data;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (!direction) {
      column = 'id';
      direction = 'asc';
    }

    // sorting countries
    this.tableData = [...this.tableData].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  viewMoreFn() {
    this.hideViewMoreBtn = true;
    this.subSectorDetailsArr$ = this.subSectorDetailsService
      .getSubSectorDetails(this.subSectorId, this.MAX_ROWS_TO_DISPLAY)
      .pipe(
        map((body: any, headers: any) => body),
        catchError((err) => {
          // console.log(`I am catchError`);
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

  getSymbolDetails(row: SubSectorDetailsRow) {
    // console.log(`navigate to SymbolDetails, ${JSON.stringify(row)}`);
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails-forwading',
      'symbolDetails',
      'forwading',
      'symbolDetails',
      1,
      this.credentialsService.credentials.email
    );
    this.router.navigate([`symbolDetails`, row.symbol], { replaceUrl: true });
  }

  printObject(obj: any) {
    return JSON.stringify(obj);
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }

  addToFavorites(symbol: string) {
    console.log(`addToFavorites : ${symbol}`);
    this.googleAnalyticsService.eventEmitter(
      'topPicks',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((body) => {});
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  removeFromFavorites(symbol: string) {
    console.log(`removeFromFavorites : ${symbol}`);
    this.googleAnalyticsService.eventEmitter(
      'subSectorDetails',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe((body) => {});
  }
}
