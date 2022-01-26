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

import { BetterPerformingService } from './betterPerforming.service';

@Component({
  selector: 'app-betterPerforming',
  templateUrl: './betterPerforming.component.html',
  styleUrls: ['./betterPerforming.component.scss'],
})
export class BetterPerformingComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  isLoading = false;
  uptrendingStocks$: Observable<any>;

  openPositionsForm!: FormGroup;
  showOpenPositionSuccess = false;
  sellPrice: string;
  sellDate: string;
  idToShow = 0;

  MIN_ROWS_TO_DISPLAY = 10;
  MAX_ROWS_TO_DISPLAY = 10000;
  totalListCount = 0;
  currentTableCount = this.MIN_ROWS_TO_DISPLAY;
  hideViewMoreBtn = false;
  tableData: any = [];

  constructor(
    private service: BetterPerformingService,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'betterPerformance-init',
      'betterPerformance',
      'init',
      'betterPerformance',
      1,
      this.credentialsService.credentials.email
    );

    console.log(`Santhosh Iniit`);
    this.readUptrendStocks(this.MIN_ROWS_TO_DISPLAY);
  }

  tableValue(data) {
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

  readUptrendStocks(rows: number) {
    console.log(`Santhosh readUptrendStocks`);
    this.uptrendingStocks$ = this.service.getBeatNasdaq(rows);
    this.uptrendingStocks$.subscribe((data) => {
      this.totalListCount = data.count;
    });
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'betterPerformance',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((data) => {
      // this.readUptrendStocks();
    });
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'betterPerformance',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe((data) => {
      // this.readUptrendStocks();
    });
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }

  viewMoreFn() {
    console.log(`Santhosh Start viewMoreFn`);
    this.currentTableCount = this.currentTableCount + this.MIN_ROWS_TO_DISPLAY;
    if (this.currentTableCount >= this.totalListCount) {
      this.hideViewMoreBtn = true;
    }
    this.readUptrendStocks(this.currentTableCount);
  }
}
