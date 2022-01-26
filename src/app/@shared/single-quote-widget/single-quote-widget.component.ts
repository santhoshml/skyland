import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '@app/@core/google-analytics.service';
import { CredentialsService } from '@app/auth';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

@Component({
  selector: 'app-single-quote-widget',
  templateUrl: './single-quote-widget.component.html',
  styleUrls: ['./single-quote-widget.component.scss'],
})
export class SingleQuoteWidgetComponent implements OnInit, AfterViewInit {
  @Input() symbol: string = '';
  @Input() exchange: string = '';
  @Input() width: string = '';
  widgetId: string;
  infoWidgetOptions = {
    showSymbolLogo: true,
    colorTheme: 'light',
    width: 380,
    isTransparent: true,
    locale: 'en',
  };

  constructor(
    private symbolDetailsService: SymbolDetailsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.widgetId = `${this.symbol}-${Math.floor(Math.random() * 100)}`;
  }

  ngAfterViewInit(): void {
    if (this.exchange) {
      this.loadWidget(`${this.exchange}:${this.symbol}`);
    } else {
      this.symbolDetailsService.getExchangeData(this.symbol).subscribe((data) => {
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
          this.loadWidget(`${exchange}:${this.symbol}`);
        }
      });
    }
  }

  loadWidget(symbol: string) {
    // console.log(this.width, '----', this.symbol, '-----', this.exchange);
    this.infoWidgetOptions['symbol'] = symbol;
    const widgetWidth = this.width ? this.width : 300;
    this.infoWidgetOptions['width'] = Number(widgetWidth);
    this.symbolDetailsService.loadTradingViewScript(this.widgetId, 'embed-widget-single-quote', this.infoWidgetOptions);
  }

  symbolDetail() {
    this.router.navigate([`/symbolDetails/${this.symbol}`], { replaceUrl: true });
  }
}
