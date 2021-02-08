import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { ListDetailsService } from './listDetails.service';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';

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

  constructor(
    private listDetailsService: ListDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'listDetails-init',
      'listDetails',
      'init',
      'listDetails',
      1,
      this.credentialsService.credentials.id
    );

    // this.listDetails$ = this.listDetailsService.getListDetails();
    this.sub = this.route.params.subscribe((params) => {
      console.log(`params : ${JSON.stringify(params)}`);
      this.listId = +params['listId']; // (+) converts string 'listId' to a number

      console.log(`this.listId : ${this.listId}`);

      // get the list from BE
      this.listDetails$ = this.listDetailsService.getListDetails(this.listId).pipe(
        map((body: any, headers: any) => {
          this.googleAnalyticsService.eventEmitter(
            'listDetails-response',
            'listDetails',
            'response',
            'listDetails',
            1,
            this.credentialsService.credentials.id
          );
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
    });

    // set user profile
    this.userProfile = this.credentialsService.userProfileModel;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getSymbolDetails(listRow: ListRow) {
    console.log(`navigate to SymbolDetails, ${JSON.stringify(listRow)}`);
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails-forwading',
      'symbolDetails',
      'forwading',
      'symbolDetails',
      1,
      this.credentialsService.credentials.id
    );
    this.router.navigate([`symbolDetails`, listRow.symbol], { replaceUrl: true });
  }
}
