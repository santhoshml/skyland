import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { IndustryListService } from './industryList.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';

export interface ListCard {
  id: number;
  key: string;
  tags: string[];
  desc: string;
  title: string;
}

@Component({
  selector: 'app-industryList',
  templateUrl: './industryList.component.html',
  styleUrls: ['./industryList.component.scss'],
})
export class IndustryListComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  cardArr: ListCard[];
  isLoading = false;
  listCard$: Observable<any>;
  subSectorList$: Observable<any>;
  // userProfile$: Observable<any>;
  hasConfidenceScore = false;
  tableData: any = [];

  constructor(
    private industryListService: IndustryListService,
    private router: Router,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'industryList-init',
      'industryList',
      'init',
      'industryList',
      1,
      this.credentialsService.userEmail
    );

    // set user profile
    // this.userProfile$ = this.authenticationService.getUserModelProfile().pipe(
    //   map((body) => {
    //     this.credentialsService.setUserProfile(body);
    //     return body;
    //   })
    // );

    this.subSectorList$ = this.industryListService.getSubSectorList().pipe(
      map((body: any, headers: any) => {
        // console.log(`body: ${JSON.stringify(body)}`);
        // console.log(`headers: ${JSON.stringify(headers)}`);
        this.googleAnalyticsService.eventEmitter(
          'industryList-response',
          'industryList',
          'response',
          'getSubSectorList',
          1,
          this.credentialsService.userEmail
        );
        return body;
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['/login', { errMsg: 'Session expired. Login please.' }], { replaceUrl: true });
        } else {
          return of(false);
        }
      })
    );
  }

  tableValue(data: any) {
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
}
