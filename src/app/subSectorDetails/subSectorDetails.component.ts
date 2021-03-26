import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SubSectorDetailsService } from './subSectorDetails.service';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';

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

  constructor(
    private subSectorDetailsService: SubSectorDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService
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
      let key = params['key']; // (+) converts string 'listId' to a number

      // console.log(`key : ${key}`);

      // get the list from BE
      this.subSectorDetailsArr$ = this.subSectorDetailsService.getSubSectorDetails(key).pipe(
        map((body: any, headers: any) => {
          this.googleAnalyticsService.eventEmitter(
            'subSectorDetails-response',
            'subSectorDetails',
            'response',
            'subSectorDetails',
            1,
            this.credentialsService.credentials.email
          );
          // console.log(`I am in body: ${JSON.stringify(body)}`);
          return body;
        }),
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
}
