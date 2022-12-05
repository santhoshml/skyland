import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { MyPortfolioService } from './myPortfolio.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import pruned from 'pruned';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { getTokenSourceMapRange } from 'typescript';

import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-myPortfolio',
  templateUrl: './myPortfolio.component.html',
  styleUrls: ['./myPortfolio.component.scss'],
})
export class MyPortfolioComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<any>;

  modalReference: NgbModalRef;
  version: string | null = environment.version;
  isLoading = false;
  // userProfile$: Observable<any>;
  yourBestStocks$: Observable<any>;
  hasConfidenceScore = false;
  newOpenPositionSymbol: string;
  openPositions: any = [];
  closedPositions: any = [];
  favorites: any = [];
  displayNotificationInTopStocks = false;
  displayNotificationInFavorites = false;
  favoritesSymbol: string;

  openPositionsForm!: FormGroup;
  showOpenPositionSuccess = false;
  sellPrice: string;
  sellDate: string;
  buyPrice: number;
  qty: number = 100;
  sellQty: number;
  selectedPortfolioSymbol: any;

  // searchbar
  keyword = 'name';
  allSymbolData = [];
  data = [];

  // pie chart
  pieTrendData = [];
  // options
  pieGradient: boolean = true;
  pieShowLegend: boolean = true;
  pieShowLabels: boolean = true;
  isPieDoughnut: boolean = false;
  pieLegendPosition: string = 'below';
  pieTrimLabels: boolean = true;
  pieMaxLabelLength = 15;

  pieColorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };

  // TreeMap
  treeMapData = [];
  // options
  treeMapView: any[] = [500, 400];
  treeMapGradient: boolean = false;
  treeMapAnimations: boolean = true;

  treeMapColorScheme = {
    domain: [],
  };

  constructor(
    private service: MyPortfolioService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService,
    private modalService: NgbModal
  ) {
    this.chartOptions = {
      redrawOnWindowResize: true,
      series: [
        {
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'treemap',
      },
      title: {
        text: "My portfolio's gain-loss ",
      },
      legend: {
        show: true,
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
        formatter: function (text, op) {
          let val = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
          }).format(op.value);
          return [text, val];
        },
        offsetY: -4,
      },
      plotOptions: {
        treemap: {
          enableShades: true,
          shadeIntensity: 0.5,
          reverseNegativeShade: true,
          colorScale: {
            ranges: [
              {
                from: -100000,
                to: -25001,
                color: '#D2042D',
              },
              {
                from: -25000,
                to: -10001,
                color: '#C41E3A',
              },
              {
                from: -10000,
                to: -5001,
                color: '#EE4B2B',
              },
              {
                from: -5000,
                to: -1001,
                color: '#E97451',
              },
              {
                from: -1000,
                to: 0,
                color: '#FAA0A0',
              },
              {
                from: 1,
                to: 1000,
                color: '#50C878',
              },
              {
                from: 1001,
                to: 5000,
                color: '#2AAA8A',
              },
              {
                from: 5001,
                to: 10000,
                color: '#00A36C',
              },
              {
                from: 10001,
                to: 25000,
                color: '#4CBB17',
              },
              {
                from: 25001,
                to: 100000,
                color: '#008000',
              },
            ],
          },
        },
      },
    };
  }

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'myPortfolio-init',
      'myPortfolio',
      'init',
      'myPortfolio',
      1,
      this.credentialsService.userEmail
    );

    // setup the Add new positions form
    this.initOpenPositionsForm();

    // default close position date
    let todayDate = moment().format('MM/DD/YYYY');
    this.sellDate = todayDate;

    // set user profile
    // this.userProfile$ = this.authenticationService.getUserModelProfile().pipe(
    //   map((body) => {
    //     this.credentialsService.setUserProfile(body);
    //     return body;
    //   })
    // );

    this.service.getAllSymbols().subscribe((data) => {
      this.allSymbolData = data;
      this.data = data.slice(0, 15);
    });

    this.readFavorites();
    this.readOpenPositions();
    this.readClosedPositions();
  }

  private initOpenPositionsForm() {
    let todayDate = moment().format('MM/DD/YYYY');
    this.openPositionsForm = this.formBuilder.group({
      symbol: ['', Validators.required],
      buy_price: ['', Validators.required],
      qty: ['', Validators.required],
      buy_date: [todayDate],
    });
  }

  thumbsUp(symbol: string) {
    // console.log(`thumbsup for ${symbol}`);
  }

  thumbsDown(symbol: string) {
    // console.log(`thumbsdown for ${symbol}`);
  }

  isFavorite(symbol: string) {
    return this.symbolDetailsService.isFavorite(symbol);
  }

  addToFavorites(symbol: string) {
    // console.log(`addToFavorites : ${symbol}`);
    this.googleAnalyticsService.eventEmitter(
      'myPortfolio',
      'favorites',
      'addToFavorites',
      'addToFavorites',
      1,
      this.credentialsService.userEmail
    );
    this.symbolDetailsService.addToFavorites(symbol).subscribe((body) => {
      // console.log(`Done addToFavorites`);

      this.readFavorites();
      this.displayNotificationInFavorites = true;
      this.favoritesSymbol = symbol;
    });
  }

  addOpenPositions() {
    let formvalue = this.openPositionsForm.value;
    // console.log(`formvalue: ${JSON.stringify(formvalue)}`);
    formvalue.symbol = this.newOpenPositionSymbol.toUpperCase();
    formvalue.buy_date = moment(formvalue.buy_date, 'MM/DD/YYYY').format('YYYY-MM-DD');
    this.newOpenPositionSymbol = formvalue.symbol;
    this.chartOptions.series[0].data = [];
    this.service.addOpenPosition(formvalue).subscribe((data) => {
      let todayDate = moment().format('MM/DD/YYYY');
      // console.log(`In addOpenPositions: ${JSON.stringify(data)}`);
      this.openPositionsForm.reset();
      this.openPositionsForm.markAsPristine();
      this.showOpenPositionSuccess = true;
      this.openPositionsForm.patchValue({
        buy_date: todayDate,
      });
      this.readOpenPositions();
      this.auto.clear();
    });
  }

  closeOpenPositionAlert() {
    this.showOpenPositionSuccess = false;
    this.newOpenPositionSymbol = null;
  }

  getDataTargetValue(id: number) {
    return `#collapseExample${id}`;
  }

  closePosition(id: number) {
    // console.log(`In closePosition, id:${id}`);
    let closePositionData = {
      id: id,
      sellPrice: this.sellPrice,
      sellQty: this.sellQty,
      sellDate: moment(this.sellDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    };
    this.service.closePosition(closePositionData).subscribe((data) => {
      this.readClosedPositions();

      // read open positions
      let index = -1;
      this.openPositions.find((item, i) => {
        if (item.id === id) {
          index = i;
        }
      });
      this.openPositions.splice(index, 1);
      this.setPieChartData(this.openPositions);
      this.setTreeMapData(this.openPositions);

      let todayDate = moment().format('MM/DD/YYYY');
      this.sellDate = todayDate;
      this.modalReference.close();
    });
  }

  updatePosition(id: number) {
    let updatePositionData = {
      buy_price: this.buyPrice,
      qty: this.qty,
      symbol: this.selectedPortfolioSymbol.symbol,
    };
    this.service.updatePosition(updatePositionData).subscribe((data) => {
      this.readOpenPositions();
      this.modalReference.close();
    });
  }

  readOpenPositions() {
    this.service.getOpenPositions().subscribe((body) => {
      this.openPositions = body;

      this.setPieChartData(body);
      this.setTreeMapData(body);
    });
  }

  private setTreeMapData(body: any) {
    this.chartOptions.series[0].data = [];
    let rawSeries = [];
    for (let row of body) {
      let gainAmt = Math.round(this.getGainAmount(row));
      if (gainAmt) {
        let position = rawSeries.find((ele) => ele.x === row.symbol);
        if (position) {
          position.y = position.y + gainAmt;
        } else {
          rawSeries.push({ x: row.symbol, y: gainAmt });
        }
      }
    }
    this.chartOptions.series[0].data = rawSeries;
  }

  private setPieChartData(list: any) {
    let uptrendPositionList = list.filter((rec) => rec.trend == 1);
    let downtrendPositionList = list.filter((rec) => rec.trend == -1);
    let neutralPositionList = list.filter((rec) => rec.trend == 0);

    this.pieTrendData = [];
    this.pieTrendData.push({ name: 'Uptrend', value: uptrendPositionList.length });
    this.pieTrendData.push({ name: 'Downtrend', value: downtrendPositionList.length });
    this.pieTrendData.push({ name: 'Neutral', value: neutralPositionList.length });

    sessionStorage.setItem('uptrend', this.getPieChartLabel(uptrendPositionList));
    sessionStorage.setItem('downtrend', this.getPieChartLabel(downtrendPositionList));
    sessionStorage.setItem('neutral', this.getPieChartLabel(neutralPositionList));
  }

  getGainAmount(row): number {
    let close = parseFloat(row.close);
    let buy = parseFloat(row.buy_price);
    let buyQty = parseFloat(row.buy_qty);
    // let sellQty = parseFloat(row.sell_qty);

    return (close - buy) * buyQty;
  }

  getGainPct(row): number {
    let close = parseFloat(row.close);
    let buy = parseFloat(row.buy_price);

    return ((close - buy) * 100) / buy;
  }

  getPieChartLabel(list: any) {
    let str = '';
    if (list && list.length > 0) {
      const mySet1 = new Set();
      for (let rec of list) {
        mySet1.add(rec.symbol);
      }
      str = Array.from(mySet1).toString();
    }
    return str;
  }

  readFavorites() {
    this.service.getFavorites().subscribe((body: any) => {
      // console.log(`yourBestStocks: ${JSON.stringify(body)}`);
      if (body.list) {
        this.credentialsService.setFavorites(this.getSymbolArr(body.list));
        this.favorites = body.list;
        return body.list;
      }
    });
  }

  getSymbolArr(list: any) {
    let arr: string[] = [];
    if (list && list.length > 0) {
      for (let rec of list) {
        arr.push(rec.symbol);
      }
    }
    return arr;
  }

  readClosedPositions() {
    this.service.getClosePositions().subscribe((body) => {
      // console.log(`my close positions : ${JSON.stringify(body)}`);
      this.closedPositions = body;
      return body;
    });
  }

  getClosePrice(event: any) {
    let symbol = event.target.value.toUpperCase();
    // console.log(`symbol: ${symbol}`);
    this.service.getPriceObject(symbol).subscribe((data) => {
      // console.log(`In getClosePrice, data:${JSON.stringify(data)}`);
      this.openPositionsForm.patchValue({
        buy_price: data.close,
        symbol: symbol,
      });
    });
  }

  enableClosePositionFlag(content: any, list: any) {
    this.selectedPortfolioSymbol = list;
    this.chartOptions.series[0].data = [];
    let openPosition = this.getOpenPositionById(list.id);
    this.sellPrice = openPosition.close;
    if (Math.round(openPosition.buy_qty) == openPosition.buy_qty) {
      this.sellQty = Math.round(openPosition.buy_qty);
    } else {
      this.sellQty = openPosition.buy_qty;
    }

    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'closePosition-modal-popup' });
  }

  updatePopupPosition(content: any, rec: any) {
    // console.log(`In updatePopupPosition : ${JSON.stringify(rec)}`);
    this.selectedPortfolioSymbol = rec;
    let openPosition = this.getOpenPositionById(rec.id);
    this.qty = 100;
    this.getClosePriceForUpdatePopup(rec.symbol);
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'updatePosition-modal-popup' });
  }

  getClosePriceForUpdatePopup(symbol: string) {
    // console.log(`symbol: ${symbol}`);
    this.service.getPriceObject(symbol).subscribe((data) => {
      // console.log(`In getClosePrice, data:${JSON.stringify(data)}`);
      this.buyPrice = data.close;
    });
  }

  getOpenPositionById(id: number) {
    return this.openPositions.length && this.openPositions.find((ele) => ele.id === id);
  }

  deleteOpenPosition(id: number) {
    // console.log(`In deleteOpenPosition, id: ${id}`);
    this.chartOptions.series[0].data = [];
    this.service.deleteOpenPosition(id).subscribe((data) => {
      let index = -1;
      this.openPositions.find((item, i) => {
        if (item.id === id) {
          index = i;
        }
      });
      this.openPositions.splice(index, 1);
      this.setPieChartData(this.openPositions);
      //
      this.setTreeMapData(this.openPositions);
    });
  }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  closeFavoritesAlert() {
    this.displayNotificationInFavorites = false;
    this.favoritesSymbol = null;
  }

  deleteFromFavorites(symbol: string) {
    // console.log(`In deleteOpenPosition, id: ${id}`);
    this.service.deleteFavorites(symbol).subscribe((data) => {
      // remove from the list
      let index = -1;
      this.favorites.find((item, i) => {
        if (item.symbol === symbol) {
          index = i;
        }
      });
      this.favorites.splice(index, 1);
      this.credentialsService.setFavorites(this.getSymbolArr(this.favorites));
    });
  }

  viewAllUptrendingStocks() {
    this.router.navigate(['/uptrendingStocks'], { replaceUrl: true });
  }

  selectEvent(item) {
    // do something with selected item
    // console.log(`In selectEvent, ${JSON.stringify(item)}`);
    if (item) {
      let symbol = item.id.toUpperCase();
      this.newOpenPositionSymbol = symbol;

      this.service.getPriceObject(symbol).subscribe((data) => {
        // console.log(`In getClosePrice, data:${JSON.stringify(data)}`);
        this.openPositionsForm.patchValue({
          buy_price: data.close,
          symbol: symbol,
        });
      });
    }
  }

  // onChangeSearch(val: string) {
  //   // fetch remote data from here
  //   // And reassign the 'data' which is binded to 'data' property.
  //   // console.log(`In onChangeSearch, ${JSON.stringify(val)}`);
  //   let filteredList = [];
  //   if (!val || val.length === 0 || !this.allSymbolData) {
  //     return [];
  //   } else {
  //     // console.log(`this.allSymbolData length : ${this.allSymbolData.length}`);
  //     let str = val.toLowerCase();
  //     // console.log(`ste:${str}`);
  //     for (let ele of this.allSymbolData) {
  //       if (ele.name.toLowerCase().includes(str)) {
  //         filteredList.push(ele);
  //       }
  //       if (filteredList.length >= 15) {
  //         this.data = filteredList;
  //       }
  //     }
  //     this.data = filteredList;
  //   }
  // }

  searchStr = '';
  onChangeSearch(val: string) {
    let startTime = new Date().getTime();
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    // console.log(`val : ${val}`);

    if (!val || val.length === 0 || !this.allSymbolData) {
      this.searchStr = '';
      return [];
    } else {
      let str = val.toLowerCase();
      if (str != this.searchStr) {
        let filteredList = [];
        let filteredNameStartsWithList = [];
        let filteredSymbol = [];
        let filteredSymbolStartsWith = [];
        let filteredMatchingSymbol = [];

        let initialArr = this.data;
        if (!this.searchStr || this.searchStr.length === 0 || (str && str.length < this.searchStr.length)) {
          initialArr = this.allSymbolData;
        }

        for (let ele of initialArr) {
          const len = str.length;
          const symbol = len <= 6 ? ele.id.toLowerCase().trim() : null;
          const name = ele.name.toLowerCase().split('-')[1].trim();

          if (len <= 6 && symbol === str) {
            filteredSymbol.push(ele);
          } else if (len <= 6 && symbol.startsWith(str)) {
            filteredSymbolStartsWith.push(ele);
          } else if (len <= 6 && symbol.includes(str)) {
            filteredMatchingSymbol.push(ele);
          } else if (name.startsWith(str)) {
            filteredNameStartsWithList.push(ele);
          } else if (name.includes(str)) {
            filteredList.push(ele);
          }
        }
        this.searchStr = str;

        this.data = [
          ...filteredSymbol,
          ...filteredSymbolStartsWith,
          ...filteredMatchingSymbol,
          ...filteredNameStartsWithList,
          ...filteredList,
        ];

        let endTime = new Date().getTime();
        console.log(`time for search  : ${endTime - startTime} ms`);
      }
    }
  }

  onFocused(e) {
    // do something when input is focused
    // console.log(`In onFocused, ${JSON.stringify(e)}`);
  }

  getPrunedValue(value: number) {
    return pruned.Number(value);
  }

  setPieLabelFormatting(c): string {
    // console.log(`setLabelFormatting : ${JSON.stringify(c)}`);
    let value = null;
    let returnValue = null;

    if (c.toLowerCase() == 'uptrend') {
      value = sessionStorage.getItem('uptrend');
    } else if (c.toLowerCase() == 'downtrend') {
      value = sessionStorage.getItem('downtrend');
    } else if (c.toLowerCase() == 'neutral') {
      value = sessionStorage.getItem('neutral');
    }

    if (value) {
      let arr = value.split(',');
      for (let val of arr) {
        if (returnValue) {
          returnValue = `${returnValue}, ${val}`;
        } else {
          returnValue = val;
        }
      }
    }

    return returnValue;
  }

  getDollarGain(sellPrice, buyPrice, qty): number {
    return (parseFloat(sellPrice) - parseFloat(buyPrice)) * parseInt(qty);
  }
}
