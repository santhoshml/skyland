import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { ListCardsService } from './listCards.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService, CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

export interface ListCard {
  id: number;
  key: string;
  tags: string[];
  desc: string;
  title: string;
}

@Component({
  selector: 'app-listCards',
  templateUrl: './listCards.component.html',
  styleUrls: ['./listCards.component.scss'],
})
export class ListCardsComponent implements OnInit {
  version: string | null = environment.version;
  cardArr: ListCard[];
  isLoading = false;
  listCard$: Observable<any>;
  subSectorList$: Observable<any>;
  userProfile$: Observable<any>;
  hasConfidenceScore = false;

  constructor(
    private listCardsService: ListCardsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'listCards-init',
      'listCards',
      'init',
      'listCards',
      1,
      this.credentialsService.credentials.email
    );

    // set user profile
    this.userProfile$ = this.authenticationService.getUserModelProfile().pipe(
      map((body) => {
        this.credentialsService.setUserProfile(body);
        return body;
      })
    );

    this.listCard$ = this.listCardsService.getAllCards().pipe(
      map((body: any, headers: any) => {
        // console.log(`body: ${JSON.stringify(body)}`);
        // console.log(`headers: ${JSON.stringify(headers)}`);
        this.googleAnalyticsService.eventEmitter(
          'listCards-response',
          'listCards',
          'response',
          'getAllCards',
          1,
          this.credentialsService.credentials.email
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

    this.subSectorList$ = this.listCardsService.getSubSectorList().pipe(
      map((body: any, headers: any) => {
        // console.log(`body: ${JSON.stringify(body)}`);
        // console.log(`headers: ${JSON.stringify(headers)}`);
        this.googleAnalyticsService.eventEmitter(
          'listCards-response',
          'listCards',
          'response',
          'getSubSectorList',
          1,
          this.credentialsService.credentials.email
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

  getList(selectedCard: ListCard) {
    // console.log(`In getList, selectedCard : ${JSON.stringify(selectedCard)} `);
    // console.log(`target URL: listDetails/${selectedCard.key}`);
    this.googleAnalyticsService.eventEmitter(
      'listCards-forwading',
      'listCards',
      'forwading',
      'getList',
      1,
      this.credentialsService.credentials.email
    );
    this.router.navigate([`listDetails`, selectedCard.id], { replaceUrl: true });
  }
}
