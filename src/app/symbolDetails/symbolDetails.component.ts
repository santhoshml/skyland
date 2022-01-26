import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { ITrendingDetails, SymbolDetailsService } from './symbolDetails.service';

declare const TradingView: any;

export interface ExchangeResp {
  exchange: string;
}

export interface SentimentResp {
  sentiment: number;
  totalScores: number;
  positive: number;
  negative: number;
  minute: string;
  value: number;
}

export interface AnalystRatingRecord {
  name: string;
  value: number;
}

export interface AnalystReccomendationResp {
  data: AnalystRatingRecord[];
}

export interface SymbolDetailsResp {
  status: string;
  data: SymbolDetails;
}

export interface SymbolDetails {
  id: number;
  user_id: number;
  date: string;
  symbol: string;
  gain_flag: number;
  confidence: string;
  price: string;
  sector: string;
  company_name: string;
  tags: string;
  accuracy: number;
}

export interface TagDetails {
  key: string;
  display: string;
  type: string;
  value: number;
  link: string;
}

export interface TagCategories {
  display_title: string;
  tags: string[];
}

@Component({
  selector: 'app-symbolDetails',
  templateUrl: './symbolDetails.component.html',
  styleUrls: ['./symbolDetails.component.scss'],
})
export class SymbolDetailsComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  version: string | null = environment.version;
  isLoading = false;
  symbolIndustryDetailsResp$: Observable<any>;
  trendingDetails$: Observable<ITrendingDetails>;
  symbolEvaluation$: Observable<any>;
  symbolDetailsResp$: Observable<SymbolDetailsResp | string>;
  sentimentResp$: Observable<SentimentResp | string>;
  analystReccomendationResp$: Observable<AnalystRatingRecord[] | string>;
  analystReccomendationList: AnalystRatingRecord[];
  private sub: any;
  tagDetailsMap: Map<string, TagDetails[]> = new Map<string, TagDetails[]>();
  tagDetailsArr: TagDetails[] = [];
  userModelTags: string[];
  activeSymbol: string;
  isFavorite = false;
  closeResult: string;
  title = 'appBootstrap';
  userNotes: string;
  tagCategories: TagCategories[];
  priceVolCategoryArr: string[];
  classificationCategoryArr: string[];
  technicalCategoryArr: string[];
  enableStockFeatures = false;
  completeSymbol: string = null;

  view: any[] = [350, 200];
  // options
  pieGradient: boolean = true;
  pieShowLegend: boolean = false;
  pieShowLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below'; //right
  colorScheme = {
    domain: ['#1dfb0b', '#ff0033', '#ffe000', '#908e8e', '#KKKKKK'],
  };

  typesMap = [
    {
      displayTitle: 'Price/Volume',
      tags: [
        'PRICE',
        'PRICE_GAP',
        'PRICE_GAP_DIR',
        'AFTER_PULLBACK',
        'NEAR_ROUND_NUMBER',
        'ILLIQUID_STOCKS',
        'WEEK_52',
        'VOLUME',
      ],
    },
  ];

  // dial guage
  public canvasWidth = 270;
  public needleValue = 65;
  public centralLabel = '';
  public name = 'Social Sentiment';
  public bottomLabel = '65';
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 2000,
    arcColors: ['rgb(255,0,0)', 'rgb(41,98,255)'],
    rangeLabel: ['Bearish', 'Bullish'],
    needleStartValue: 50,
    arcDelimiters: [10],
  };

  public chartData = {
    value: [],
    view: [500, 200],
    showXAxis: true,
    showYAxis: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    colorScheme: {
      domain: [],
    },
  };

  constructor(
    private symbolDetailsService: SymbolDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private modalService: NgbModal,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    // console.log(`I am in ngOnInit`);
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails-init',
      'symbolDetails',
      'init',
      'init',
      1,
      this.credentialsService.userEmail
    );

    // get tag categories
    this.symbolDetailsService.getTagCategories().subscribe((data: TagCategories[]) => {
      this.googleAnalyticsService.eventEmitter(
        'symbolDetails-init',
        'symbolDetails',
        'init',
        'getTagCategories',
        1,
        this.credentialsService.userEmail
      );
      this.tagCategories = data;
      this.priceVolCategoryArr = data[0].tags;
      this.classificationCategoryArr = data[1].tags;
      this.technicalCategoryArr = data[2].tags;
    });

    // get tag details
    this.symbolDetailsService.getTagDetails().subscribe((data: Map<string, TagDetails[]>) => {
      this.googleAnalyticsService.eventEmitter(
        'symbolDetails-init',
        'symbolDetails',
        'init',
        'getTagDetails',
        1,
        this.credentialsService.userEmail
      );
      this.tagDetailsMap = data;
      for (const [key, value] of Object.entries(this.tagDetailsMap)) {
        this.tagDetailsArr = this.tagDetailsArr.concat(value);
      }
    });

    this.sub = this.route.params.subscribe((params) => {
      this.activeSymbol = params['symbol'].toUpperCase();
      this.completeSymbol = this.activeSymbol;

      this.symbolEvaluation$ = this.symbolDetailsService.getSymbolEvaluation(this.activeSymbol);

      this.trendingDetails$ = this.symbolDetailsService.getTrendingDetails(this.activeSymbol).pipe(
        map((body: ITrendingDetails) => {
          this.googleAnalyticsService.eventEmitter(
            'trendingDetails-init',
            'trendingDetails',
            'init',
            'getTrendingDetails',
            1,
            this.credentialsService.userEmail
          );
          return body;
        })
      );

      //get exchange data
      this.symbolDetailsService.getExchangeData(this.activeSymbol).subscribe((data) => {
        this.googleAnalyticsService.eventEmitter(
          'symbolDetails-init',
          'symbolDetails',
          'init',
          'getExchangeData',
          1,
          this.credentialsService.userEmail
        );
        let exchange = data['exchange'];
        if (exchange) {
          this.completeSymbol = `${exchange}:${this.activeSymbol}`;
        }

        // init InfoWidget
        this.loadInfoWidget(this.completeSymbol);

        // load chart
        this.loadChart(this.completeSymbol);

        // technical info widget
        this.loadTechnicalInfoWidget(this.completeSymbol);
      });

      this.symbolDetailsResp$ = this.symbolDetailsService.getListDetails(this.activeSymbol).pipe(
        map((body: any, headers: any) => {
          this.googleAnalyticsService.eventEmitter(
            'symbolDetails-init',
            'symbolDetails',
            'init',
            'getListDetails',
            1,
            this.credentialsService.userEmail
          );
          if (body.symbol) {
            this.enableStockFeatures = true;
          }
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

      // set Favorite flag
      this.isFavorite = this.symbolDetailsService.isFavorite(this.activeSymbol);

      // getSentiment data
      this.sentimentResp$ = this.symbolDetailsService.getSentimentData(this.activeSymbol);
      this.sentimentResp$.subscribe((data: any) => {
        this.options = { ...this.options, arcDelimiters: [data.negative * 100] };
      });

      // AnalystReccomendation data
      this.analystReccomendationResp$ = this.symbolDetailsService.getAnalystReccomendationData(this.activeSymbol).pipe(
        map((body: AnalystReccomendationResp) => {
          if (body) {
            this.analystReccomendationList = body.data;
            return body.data;
          }
          return [];
        })
      );

      // get notes
      this.symbolDetailsService.getUserNotes(this.activeSymbol).subscribe((data) => {
        this.googleAnalyticsService.eventEmitter(
          'symbolDetails-init',
          'symbolDetails',
          'init',
          'getUserNotes',
          1,
          this.credentialsService.userEmail
        );
        this.userNotes = data.notes;
      });

      this.symbolIndustryDetailsResp$ = this.symbolDetailsService.getSymbolIndustryDetails(this.activeSymbol).pipe(
        map((data: any) => {
          this.IndustryDetailsChatData(data);
          return data;
        })
      );
    });

    // load tags from userModelProfile
    this.userModelTags = this.credentialsService.userProfileModel
      ? this.credentialsService.userProfileModel.selected_params
      : [];
  }

  IndustryDetailsChatData(data) {
    this.chartData.colorScheme.domain = [];
    this.chartData.value = [
      {
        name: '1-Week Gain',
        series: this.addChartColorValue('1-Week Gain', data.perf_week),
      },
      {
        name: '1-Month Gain',
        series: this.addChartColorValue('1-Month Gain', data.perf_month),
      },
      {
        name: 'Quarterly Gain',
        series: this.addChartColorValue('Quarterly Gain', data.perf_quart),
      },
      {
        name: '6-Month Gain',
        series: this.addChartColorValue('6-Month Gain', data.perf_half),
      },
      {
        name: '1-Year gain',
        series: this.addChartColorValue('1-Year Gain', data.perf_year),
      },
      {
        name: 'YTD gain',
        series: this.addChartColorValue('YTD gain', data.perf_ytd),
      },
    ];
  }

  private addChartColorValue(name, data) {
    const value = Number(data);
    this.chartData.colorScheme.domain.push(value < 0 ? '#ff0000' : '#008000');
    return [{ name, value }];
  }

  private loadTechnicalInfoWidget(symbol) {
    let technicalsInfoWIdget = {
      interval: '1D',
      isTransparent: true,
      height: 410,
      symbol: symbol,
      showIntervalTabs: true,
      locale: 'en',
      colorTheme: 'light',
    };
    this.symbolDetailsService.loadTradingViewScript(
      'symbolTechnicalsWidget',
      'embed-widget-technical-analysis',
      technicalsInfoWIdget
    );
  }

  private loadInfoWidget(symbol) {
    let infoWidgetOptions = {
      symbol: symbol,
      width: '100%',
      locale: 'en',
      colorTheme: 'light',
      isTransparent: true,
    };
    this.symbolDetailsService.loadTradingViewScript('symbolInfoWidget', 'embed-widget-symbol-info', infoWidgetOptions);
  }

  getAnalystReccomendationValue(name: string) {
    if (this.analystReccomendationList && this.analystReccomendationList.length > 0) {
      for (let ele of this.analystReccomendationList) {
        if (ele.name.toUpperCase() == name.toUpperCase()) {
          return ele.value;
        }
      }
    }
    return 0;
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.googleAnalyticsService.eventEmitter(
          'symbolDetails',
          'modalService.open',
          'modalService-closed',
          result,
          0,
          this.credentialsService.userEmail
        );
        this.closeResult = `Closed with: ${result}`;
        this.symbolDetailsService.saveUserNotes(this.activeSymbol, this.userNotes).subscribe();
      },
      (reason) => {
        this.googleAnalyticsService.eventEmitter(
          'symbolDetails',
          'modalService.open',
          'modalService-closed',
          reason,
          0,
          this.credentialsService.userEmail
        );
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  filterEvaluation(type, data) {
    var filteredArray = data.filter((item) => {
      return item.type === type;
    });
    return filteredArray;
  }

  addToFavorites() {
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.userEmail
    );
    this.isFavorite = true;
    this.symbolDetailsService.addToFavorites(this.activeSymbol).subscribe();
  }

  removeFromFavorites() {
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails',
      'favorites',
      'removeFromFavorites',
      'removeFromFavorites',
      0,
      this.credentialsService.userEmail
    );
    this.isFavorite = false;
    this.symbolDetailsService.removeFromFavorites(this.activeSymbol).subscribe();
  }

  loadChart(symbol: string) {
    this.googleAnalyticsService.eventEmitter(
      'symbolDetails',
      'chart',
      'loadChart',
      symbol,
      1,
      this.credentialsService.userEmail
    );
    new TradingView.widget({
      symbol: this.activeSymbol,
      width: '100%',
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'light',
      style: '3',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: false,
      save_image: false,
      details: false,
      container_id: 'tradingview_73abe',
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getArray(str: string) {
    if (str) {
      let sortedArr = JSON.parse(str).sort((a: string, b: string) => a.length - b.length);
      return sortedArr;
    }
    return [];
  }

  getTagDisplayText(str: string) {
    let ele: TagDetails = this.tagDetailsArr.find((element: TagDetails) => element.key === str);
    return ele ? ele.display : str;
  }

  gotoTagLink(str: string) {
    let ele: TagDetails = this.tagDetailsArr.find((element: TagDetails) => element.key === str);
    let retVal = ele ? ele.link : '#';
    window.open(retVal, '_blank');
  }

  isExistsInPriceVol(val: string): boolean {
    if (this.priceVolCategoryArr) {
      for (let tag of this.priceVolCategoryArr) {
        if (tag.toLowerCase() == val.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  isExistsInClassification(val: string): boolean {
    if (this.classificationCategoryArr) {
      for (let tag of this.classificationCategoryArr) {
        if (tag.toLowerCase() == val.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  isExistsInTechnical(val: string): boolean {
    if (this.technicalCategoryArr) {
      for (let tag of this.technicalCategoryArr) {
        if (tag.toLowerCase() == val.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  getClassForPills(tag: string): string {
    if (this.userModelTags.find((str) => str === tag)) {
      return 'badge badge-pill badge-primary';
    }
    return 'badge badge-pill badge-light';
  }

  onSelect(data: any): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
