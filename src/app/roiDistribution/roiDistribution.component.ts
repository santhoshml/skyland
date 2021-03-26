import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { RoiDistributionService } from './roiDistribution.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GoogleAnalyticsService } from '@app/@core';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-roiDistribution',
  templateUrl: './roiDistribution.component.html',
  styleUrls: ['./roiDistribution.component.scss'],
})
export class RoiDistributionComponent implements OnInit {
  version: string | null = environment.version;
  isLoading = false;

  roiData: any;
  holdDaysData: any;
  txnStats: any;

  constructor(
    private roiDistributionService: RoiDistributionService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'roiDistribution-init',
      'roiDistribution',
      'init',
      'init',
      1,
      this.credentialsService.credentials.email
    );

    this.roiDistributionService.getDistribution().subscribe((data) => {
      this.googleAnalyticsService.eventEmitter(
        'roiDistribution-init',
        'roiDistribution',
        'init',
        'getDistribution',
        1,
        this.credentialsService.credentials.email
      );
      // console.log(`data: ${JSON.stringify(data)}`);
      this.roiData = data.roi;
      this.holdDaysData = data.holdDays;
    });

    this.roiDistributionService.getTxnStats().subscribe((data) => {
      this.googleAnalyticsService.eventEmitter(
        'roiDistribution-init',
        'roiDistribution',
        'init',
        'getTxnStats',
        1,
        this.credentialsService.credentials.email
      );
      // console.log(`txn stats: ${JSON.stringify(data)}`);
      this.txnStats = data;
    });
  }
}
