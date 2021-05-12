import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { UptrendingStocksService } from './uptrendingStocks.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService, CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import pruned from 'pruned';

@Component({
  selector: 'app-uptrendingStocks',
  templateUrl: './uptrendingStocks.component.html',
  styleUrls: ['./uptrendingStocks.component.scss'],
})
export class UptrendingStocksComponent implements OnInit {
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
  hideViewMoreBtn = false;

  constructor(
    private service: UptrendingStocksService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'uptrendingStocks-init',
      'uptrendingStocks',
      'init',
      'uptrendingStocks',
      1,
      this.credentialsService.credentials.email
    );

    this.readUptrendStocks(this.MIN_ROWS_TO_DISPLAY);
  }

  readUptrendStocks(rows: number) {
    this.uptrendingStocks$ = this.service.getUptrendingStocks(rows).pipe(
      map((body) => {
        // console.log(`topStocks : ${JSON.stringify(body)}`);
        return body;
      })
    );
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'uptrendingStocks',
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
      'uptrendingStocks',
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
    this.hideViewMoreBtn = true;
    this.readUptrendStocks(this.MAX_ROWS_TO_DISPLAY);
  }
}
