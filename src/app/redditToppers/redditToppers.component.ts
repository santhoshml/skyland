import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import pruned from 'pruned';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';

import { RedditToppersService } from './redditToppers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redditToppers',
  templateUrl: './redditToppers.component.html',
  styleUrls: ['./redditToppers.component.scss'],
})
export class RedditToppersComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  isLoading = false;
  redditStocks$: Observable<any>;

  openPositionsForm!: FormGroup;
  showOpenPositionSuccess = false;
  sellPrice: string;
  sellDate: string;
  idToShow = 0;

  MIN_ROWS_TO_DISPLAY = 10;
  MAX_ROWS_TO_DISPLAY = 100;
  totalListCount = 0;
  currentTableCount = this.MIN_ROWS_TO_DISPLAY;
  hideViewMoreBtn = false;
  tableData: any = [];

  constructor(
    private service: RedditToppersService,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'redditToppers-init',
      'redditToppers',
      'init',
      'redditToppers',
      1,
      this.credentialsService.userEmail
    );

    this.readRedditToppers(this.MIN_ROWS_TO_DISPLAY);
  }

  tableValue(data: any) {
    data.forEach((val, i) => (val.index = i + 1));
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
      column = 'index';
      direction = 'asc';
    }

    // sorting countries
    this.tableData = [...this.tableData].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  readRedditToppers(rows: number) {
    this.redditStocks$ = this.service.getRedditToppers(rows);
    this.redditStocks$.subscribe((data) => {
      this.totalListCount = data.count;
    });
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'redditStocks',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.userEmail
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((data) => {
      // this.readUptrendStocks();
    });
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'redditStocks',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      1,
      this.credentialsService.userEmail
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe((data) => {
      // this.readUptrendStocks();
    });
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }

  viewMoreFn() {
    this.currentTableCount = this.currentTableCount + this.MIN_ROWS_TO_DISPLAY;
    if (this.currentTableCount >= this.totalListCount) {
      this.hideViewMoreBtn = true;
    }
    this.readRedditToppers(this.currentTableCount);
  }

  gotoDetails(symbol: string) {
    this.router.navigate([`/symbolDetails/${symbol}`], { replaceUrl: true });
  }
}
