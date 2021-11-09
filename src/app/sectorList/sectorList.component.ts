import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { SectorListService } from './sectorList.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sectorList',
  templateUrl: './sectorList.component.html',
  styleUrls: ['./sectorList.component.scss'],
})
export class SectorListComponent implements OnInit {
  modalReference: NgbModalRef;
  version: string | null = environment.version;
  isLoading = false;
  userProfile$: Observable<any>;
  topStocks$: Observable<any>;
  yourBestStocks$: Observable<any>;
  favorites$: Observable<any>;
  watchlist$: Observable<any>;
  allSectorList$: Observable<any>;
  myOpenPositions$: Observable<any>;
  myClosePositions$: Observable<any>;
  hasConfidenceScore = false;
  newOpenPositionSymbol: string;
  openPositions: any = [];
  displayNotificationInTopStocks = false;
  topStocksNotificationMsg: string;
  displayNotificationInFavorites = false;
  favoritesSymbol: string;

  openPositionsForm!: FormGroup;
  showOpenPositionSuccess = false;
  sellPrice: string;
  sellDate: string;
  buyPrice: number;
  qty: number;
  selectedPortfolioSymbol: any;

  // searchbar
  keyword = 'name';
  allSymbolData = [];
  data = [];

  constructor(
    private service: SectorListService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'sectorList-init',
      'sectorList',
      'init',
      'sectorList',
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

    this.allSectorList$ = this.service.getAllSectors();
  }

  gotoSectorList(card) {
    // console.log(`navigate to SymbolDetails, ${JSON.stringify(listRow)}`);
    this.googleAnalyticsService.eventEmitter(
      'sectorList-forwading',
      'sectorList',
      'forwading',
      'sectorList',
      1,
      this.credentialsService.credentials.email
    );
    this.router.navigate([`sectorDetails`, card.symbol], { replaceUrl: true });
  }
}
