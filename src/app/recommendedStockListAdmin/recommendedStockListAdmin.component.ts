import { Component, OnInit, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { RecommendedStockListAdminService } from './recommendedStockListAdmin.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';

@Component({
  selector: 'app-recommendedStockListAdmin',
  templateUrl: './recommendedStockListAdmin.component.html',
  styleUrls: ['./recommendedStockListAdmin.component.scss'],
})
export class RecommendedStockListAdminComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  isLoading = false;
  topStocksList$: Observable<any>;
  tableData: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private recommendedStockListAdminService: RecommendedStockListAdminService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'recommendedStockListAdmin-init',
      'recommendedStockListAdmin',
      'init',
      'recommendedStockListAdmin',
      1,
      this.credentialsService.userEmail
    );

    this.topStocksList$ = this.recommendedStockListAdminService.getAllReccomendedStocksList();
  }

  tableValue(data) {
    this.tableData = data;
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (!direction) {
      column = 'date';
      direction = 'desc';
    }

    // sorting countries
    this.tableData = [...this.tableData].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

  ngOnDestroy() {}
}
