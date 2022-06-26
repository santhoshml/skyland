import { Component, OnInit, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { GoogleAnalyticsService, Logger } from '@app/@core';
import { AdminUsersDetailsService } from './adminUsersDetails.service';
import { compare, SortEvent, TableSortableHeaderDirective } from '@app/@shared';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminUsersDetails',
  templateUrl: './adminUsersDetails.component.html',
  styleUrls: ['./adminUsersDetails.component.scss'],
})
export class AdminUsersDetailsComponent implements OnInit {
  version: string | null = environment.version;
  email: string;
  private sub: any;
  userDetailsAdmin$: Observable<any>;
  msgDisplay: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private service: AdminUsersDetailsService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.googleAnalyticsService.eventEmitter(
      'adminUsersDetails-init',
      'adminUsersDetails',
      'init',
      'adminUsersDetails',
      1,
      this.credentialsService.userEmail
    );

    this.sub = this.route.params.subscribe((params) => {
      // console.log(`params: ${JSON.stringify(params)}`);
      this.email = params['email'];
      this.userDetailsAdmin$ = this.service.getUserDetailsAdmin(this.email);
    });

    this.msgDisplay = null;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  toggleDailyEmail() {
    this.msgDisplay = null;
    this.service.toggleDailyEmail({ email: this.email }).subscribe((rsp) => {
      this.userDetailsAdmin$ = this.service.getUserDetailsAdmin(this.email);
      this.msgDisplay = `Daily Market update email toggled for ${this.email}`;
    });
  }

  disableUser() {
    this.msgDisplay = null;
    this.service.disableUser({ email: this.email }).subscribe((rsp) => {
      this.userDetailsAdmin$ = this.service.getUserDetailsAdmin(this.email);
      this.msgDisplay = `${this.email} User diabled`;
    });
  }

  enableUser() {
    this.msgDisplay = null;
    this.service.enableUser({ email: this.email }).subscribe((rsp) => {
      this.userDetailsAdmin$ = this.service.getUserDetailsAdmin(this.email);
      this.msgDisplay = `${this.email} User enabled`;
    });
  }

  sendDailyEmail(email: string) {
    // console.log(`In sendDailyEmail, ${email}`);
    this.msgDisplay = null;
    this.service.sendDailyEmail(email).subscribe((rsp) => {
      this.msgDisplay = `Market Update Email sent to ${email}`;
    });
  }
}
