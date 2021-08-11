import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

@Component({
  selector: 'app-single-quote-widget',
  templateUrl: './single-quote-widget.component.html',
  styleUrls: ['./single-quote-widget.component.scss'],
})
export class SingleQuoteWidgetComponent implements OnInit, AfterViewInit {
  @Input() symbol: string = '';
  infoWidgetOptions = {
    showSymbolLogo: true,
    colorTheme: 'light',
    width: 380,
    isTransparent: true,
    locale: 'en',
  };

  constructor(private symbolDetailsService: SymbolDetailsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.loadWidget();
  }

  loadWidget() {
    this.infoWidgetOptions['symbol'] = this.symbol;
    this.symbolDetailsService.loadTradingViewScript(this.symbol, 'embed-widget-single-quote', this.infoWidgetOptions);
  }
}
