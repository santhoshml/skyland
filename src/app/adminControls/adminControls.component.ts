import { Component, OnInit, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { AdminControlsService } from './adminControls.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminControls',
  templateUrl: './adminControls.component.html',
  styleUrls: ['./adminControls.component.scss'],
})
export class AdminControlsComponent implements OnInit {
  version: string | null = environment.version;
  isLoading = false;
  tableData: any = [];
  maxCurrDateValue = '';
  nextMaxCurrDateValue = '';
  newSymbol = '';
  newSymbolJSONForAllSymbols = `{
    "source" : "twelve",
    "symbol" : "VXX12",
    "exchange" : "NASDAQ",
    "name" : "VXX",
    "type" : "Common Stock"
  }`;
  maxCurrDateUpdateMsg = null;
  industryFileUploadMsg = null;
  newSymbolJSONForAllSymbolsMsg = null;
  addSymbolToTopStocksMsg = null;
  publishTodayDataMsg = null;
  updateTwelveDataMsg = null;
  dailyEmailDataMsg = null;

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private service: AdminControlsService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'adminControls-init',
      'adminControls',
      'init',
      'adminControls',
      1,
      this.credentialsService.userEmail
    );
    this.getMaxCurrDate();
  }

  getMaxCurrDate() {
    this.authenticationService.getConfigValue('max_curr_date').subscribe({
      next: (data) => {
        // console.log(data);
        this.maxCurrDateValue = data.value_str;
        this.nextMaxCurrDateValue = moment().format('YYYY-MM-DD');
      },
    });
  }

  ngOnDestroy() {}

  updateMaxCurrDate() {
    // console.log(`nextMaxCurrDateValue : ${this.nextMaxCurrDateValue}`);
    let data = {
      key_str: 'max_curr_date',
      value_str: this.nextMaxCurrDateValue,
    };
    this.service.updateConfigValue(data).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.maxCurrDateUpdateMsg = 'max_curr_date value updated succesfully.';
        }
        this.getMaxCurrDate();
      },
    });
  }

  updateTwelveData() {
    let data = {
      returnImmediately: false,
    };
    this.service.updateTwelveData(data).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.updateTwelveDataMsg = `Started to download data from Twelve`;
        }
      },
    });
  }

  publishTodayData() {
    let data = {
      returnImmediately: false,
    };
    this.service.publishTodayData(data).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.publishTodayDataMsg = `Today's data published`;
        }
      },
    });
  }

  uploadIndustryFile() {
    const formData = new FormData();
    formData.append('industryPerf', this.myForm.get('fileSource').value);

    this.service.uploadIndustryFile(formData).subscribe((res) => {
      if (res.status === 'success') {
        // console.log(res);
        this.myForm.reset();
        this.industryFileUploadMsg = 'Industry File Uploaded succesfully';
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file,
      });
    }
  }

  addSymbolToTopStocks() {
    this.service.addSymbolToTopStocks(this.newSymbol).subscribe({
      next: (resp) => {
        if (resp.status === 'success') {
          this.addSymbolToTopStocksMsg = `New Symbol Added to Top Stocks`;
        }
      },
    });
  }

  addNewSymbolToAllSymbols() {
    this.service.addNewSymbolToAllSymbols(this.newSymbolJSONForAllSymbols).subscribe({
      next: (resp) => {
        if (resp) {
          this.newSymbolJSONForAllSymbolsMsg = `New Symbol added to Mongo`;
        }
      },
    });
  }

  sendDailyEmailData() {
    let data = {
      returnImmediately: false,
    };
    this.service.sendDailyEmailData(data).subscribe({
      next: (resp) => {
        if (resp) {
          this.dailyEmailDataMsg = `Daily Email sent to All`;
        }
      },
    });
  }
}
