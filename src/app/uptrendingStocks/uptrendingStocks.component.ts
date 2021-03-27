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

    this.readUptrendStocks();
  }

  readUptrendStocks() {
    this.uptrendingStocks$ = this.service.getUptrendingStocks().pipe(
      map((body) => {
        // console.log(`topStocks : ${JSON.stringify(body)}`);
        return body;
      })
    );
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
      this.readUptrendStocks();
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
      this.readUptrendStocks();
    });
  }
}
