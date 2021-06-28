import { Component, OnInit, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { AllUserListAdminService } from './allUserListAdmin.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';

@Component({
  selector: 'app-allUserListAdmin',
  templateUrl: './allUserListAdmin.component.html',
  styleUrls: ['./allUserListAdmin.component.scss'],
})
export class AllUserListAdminComponent implements OnInit {
  @ViewChildren(TableSortableHeaderDirective) headers: QueryList<TableSortableHeaderDirective>;
  version: string | null = environment.version;
  isLoading = false;
  allUserList$: Observable<any>;
  tableData: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private allUserListAdminService: AllUserListAdminService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'subSectorDetails-init',
      'subSectorDetails',
      'init',
      'subSectorDetails',
      1,
      this.credentialsService.credentials.email
    );

    this.allUserList$ = this.allUserListAdminService.getAllUsers();
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
      column = 'created_dt';
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
