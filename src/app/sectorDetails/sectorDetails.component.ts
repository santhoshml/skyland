import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SectorDetailsService } from './sectorDetails.service';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import pruned from 'pruned';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';

@Component({
  selector: 'app-sectorDetails',
  templateUrl: './sectorDetails.component.html',
  styleUrls: ['./sectorDetails.component.scss'],
})
export class SectorDetailsComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  isLoading = false;
  sectorDetails$: Observable<any>;
  private sub: any;
  userProfile: UserProfileModel;
  sectorSymbol = '';

  MIN_ROWS_TO_DISPLAY = 10;
  MAX_ROWS_TO_DISPLAY = 10000;
  hideViewMoreBtn = false;
  tableData: any = [];

  constructor(
    private sectorDetailsService: SectorDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'sectorDetails-init',
      'sectorDetails',
      'init',
      'sectorDetails',
      1,
      this.credentialsService.credentials.email
    );

    // this.listDetails$ = this.listDetailsService.getListDetails();
    this.sub = this.route.params.subscribe((params) => {
      // console.log(`params : ${JSON.stringify(params)}`);
      this.sectorSymbol = params['key']; // (+) converts string 'listId' to a number

      this.sectorDetails$ = this.sectorDetailsService.getSectorDetails(this.sectorSymbol, this.MIN_ROWS_TO_DISPLAY);
    });

    // set user profile
    this.userProfile = this.credentialsService.userProfileModel;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    this.sectorDetails$ = this.sectorDetailsService.getSectorDetails(this.sectorSymbol, this.MAX_ROWS_TO_DISPLAY);
  }

  getSymbolDetails(listRow: any) {
    // console.log(`navigate to SymbolDetails, ${JSON.stringify(listRow)}`);
    this.googleAnalyticsService.eventEmitter(
      'sectorDetails-forwading',
      'sectorDetails',
      'forwading',
      'sectorDetails',
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
      'sectorDetails',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((data) => {});
  }

  removeFromFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'sectorDetails',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      1,
      this.credentialsService.credentials.email
    );
    this.symbolDetailsService.removeFromFavorites(symbol).subscribe((data) => {});
  }
}
