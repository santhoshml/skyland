import { Component, Input, OnInit } from '@angular/core';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

@Component({
  selector: 'app-view-trend-details',
  templateUrl: './view-trend-details.component.html',
  styleUrls: ['./view-trend-details.component.scss'],
})
export class ViewTrendDetailsComponent implements OnInit {
  @Input() symbol: string = '';
  constructor(private symbolDetailsService: SymbolDetailsService) {}

  ngOnInit(): void {}

  showTrendDetails() {
    this.symbolDetailsService.activeSymbol.next(this.symbol);
  }
}
