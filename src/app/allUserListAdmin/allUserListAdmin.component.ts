import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { AllUserListAdminService } from './allUserListAdmin.service';

@Component({
  selector: 'app-allUserListAdmin',
  templateUrl: './allUserListAdmin.component.html',
  styleUrls: ['./allUserListAdmin.component.scss'],
})
export class AllUserListAdminComponent implements OnInit {
  version: string | null = environment.version;
  isLoading = false;
  allUserList$: Observable<any>;

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

  ngOnDestroy() {}
}
