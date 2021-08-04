import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ITrendingDetails, SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-trend-details',
  templateUrl: './trend-details.component.html',
  styleUrls: ['./trend-details.component.scss'],
})
export class TrendDetailsComponent implements OnInit {
  trendResult: ITrendingDetails;
  @ViewChild('popupContent') popupContent: ElementRef;
  activeSymbol: string;
  constructor(private modalService: NgbModal, private symbolDetailsService: SymbolDetailsService) {}

  ngOnInit(): void {
    this.symbolDetailsService.activeSymbol.subscribe({
      next: (symbol) => {
        this.activeSymbol = symbol;
        console.log(`observerA: ${symbol}`);
        this.openTrendDetailsPopup(symbol);
      },
    });
  }

  openTrendDetailsPopup(symbol: string) {
    this.symbolDetailsService.getTrendingDetails(symbol).subscribe((data: ITrendingDetails) => {
      this.trendResult = data;
      this.modalService.open(this.popupContent, { ariaLabelledBy: 'trend-modal-popup' });
    });
  }
}
