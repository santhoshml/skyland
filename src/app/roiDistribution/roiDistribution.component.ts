import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { RoiDistributionService } from './roiDistribution.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  constructor(private roiDistributionService: RoiDistributionService,
    private router: Router,
    private route: ActivatedRoute) {}
    

  ngOnInit() {
    this.roiDistributionService.getDistribution().subscribe(data=>{
      console.log(`data: ${JSON.stringify(data)}`);
      this.roiData = data.roi;
      this.holdDaysData = data.holdDays;
    });

    this.roiDistributionService.getTxnStats().subscribe(data=>{
      console.log(`txn stats: ${JSON.stringify(data)}`);
      this.txnStats = data;
    });
  }


}
