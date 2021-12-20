import { Component, OnInit, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { AllUserListAdminService } from './allUserListAdmin.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';
import * as moment from 'moment';

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
  addedRowIndex = [];
  msgObject = {};

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
    this.msgObject = {};
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

  enableUser(email: string) {
    this.allUserListAdminService.enableUser({ email: email }).subscribe((rsp) => {
      this.allUserList$ = this.allUserListAdminService.getAllUsers();
      this.msgObject = {};
    });
  }

  disableUser(email: string) {
    this.allUserListAdminService.disableUser({ email: email }).subscribe((rsp) => {
      this.allUserList$ = this.allUserListAdminService.getAllUsers();
      this.msgObject = {};
    });
  }

  sendDailyEmail(email: string) {
    this.allUserListAdminService.sendDailyEmail(email).subscribe((rsp) => {
      this.msgObject = {
        email: email,
        msg: 'Daily email sent.',
      };
    });
  }

  enableViewComments(index: number, arr: string[]) {
    let tableRef = document.getElementById('all-user-list') as HTMLTableElement;
    let numOfRowsExpanded = this.indexLessThan(index);
    let newRow = tableRef.insertRow(index + numOfRowsExpanded + 2);

    let newCell = newRow.insertCell(0);
    newCell.colSpan = 8;
    for (let commentEle of arr) {
      let formattedDt = moment(new Date(commentEle['insert_ts'])).format('MM/DD/YYYY hh:mm:ss A');
      let ts = document.createTextNode(formattedDt);
      newCell.appendChild(ts);

      let tab = document.createTextNode(' --- ');
      newCell.appendChild(tab);

      let text = document.createTextNode(commentEle['comments']);
      newCell.appendChild(text);

      let linebreak = document.createElement('br');
      newCell.appendChild(linebreak);
    }
    this.addedRowIndex.push(index + 1);
  }

  indexLessThan(index: number) {
    let count = 0;
    if (this.addedRowIndex.length > 0) {
      for (let idx of this.addedRowIndex) {
        if (idx < index) count++;
      }
    }
    return count;
  }

  getUserCount(tableData: any, value: boolean) {
    // console.log(`tableData : ${JSON.stringify(tableData)}`);
    let count = 0;
    for (let rec of tableData) {
      if (rec.isValid === value) {
        count++;
      }
    }
    return count;
  }

  toggleDailyEmail(email: string) {
    this.allUserListAdminService.toggleDailyEmail({ email: email }).subscribe((rsp) => {
      this.allUserList$ = this.allUserListAdminService.getAllUsers();
      this.msgObject = {};
    });
  }
}
