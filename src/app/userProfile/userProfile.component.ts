import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { UserProfileService } from './userProfile.service';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

export interface TagDetails {
  key: string;
  display: string;
  type: string;
  value: number;
  link: string;
}

export interface TagCategories {
  display_title: string;
  tags: string[];
}

@Component({
  selector: 'app-userProfile',
  templateUrl: './userProfile.component.html',
  styleUrls: ['./userProfile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  version: string | null = environment.version;
  userProfile: UserProfileModel;
  tagCategories: TagCategories[];
  priceVolCategoryArr: string[];
  classificationCategoryArr: string[];
  technicalCategoryArr: string[];
  tagDetailsMap: Map<string, TagDetails[]> = new Map<string, TagDetails[]>();
  tagDetailsArr: TagDetails[] = [];
  userDetails$: Observable<any>;
  userProfileForm!: FormGroup;
  displayUpdatNotif = false;

  constructor(
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private userProfileService: UserProfileService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // initialse the form
    this.userProfileForm = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: [''],
      expertise: [''],
    });

    // get tag categories
    this.userProfileService.getTagCategories().subscribe((data: TagCategories[]) => {
      this.googleAnalyticsService.eventEmitter(
        'userProfile-init',
        'userProfile',
        'init',
        'getTagCategories',
        1,
        this.credentialsService.userEmail
      );

      this.tagCategories = data;
      this.priceVolCategoryArr = data[0].tags;
      this.classificationCategoryArr = data[1].tags;
      this.technicalCategoryArr = data[2].tags;
    });

    // get tag details
    this.userProfileService.getTagDetails().subscribe((data: Map<string, TagDetails[]>) => {
      this.googleAnalyticsService.eventEmitter(
        'userProfile-init',
        'userProfile',
        'init',
        'getTagDetails',
        1,
        this.credentialsService.userEmail
      );
      this.tagDetailsMap = data;
      for (const [key, value] of Object.entries(this.tagDetailsMap)) {
        this.tagDetailsArr = this.tagDetailsArr.concat(value);
      }
    });

    // set user profile
    this.userProfile = this.credentialsService.userProfileModel;
    // console.log(`this.userProfile : ${JSON.stringify(this.userProfile)}`);

    this.userDetails$ = this.userProfileService.getUserDetails().pipe(
      map((body: any, headers: any) => {
        // console.log(`In userDetails body: ${JSON.stringify(body)}`);
        // console.log(`headers: ${JSON.stringify(headers)}`);
        this.googleAnalyticsService.eventEmitter(
          'userProfile-response',
          'userProfile',
          'response',
          'getUserDetails',
          1,
          this.credentialsService.userEmail
        );

        this.userProfileForm.patchValue({
          name: body.user.profile.name,
          email: body.user.email,
          phone: body.user.profile.phone,
          expertise: body.user.profile.expertise,
        });
        this.userProfileForm.controls['email'].disable();
        // console.log(`body: ${JSON.stringify(body)}`);
        return body;
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['/login', { errMsg: 'Session expired. Login please.' }], { replaceUrl: true });
        } else {
          return of(false);
        }
      })
    );
  }

  getArray(arr: string[]) {
    if (arr && arr.length > 0) {
      let sortedArr = arr.sort((a: string, b: string) => a.length - b.length);
      return sortedArr;
    }
    return [];
  }

  gotoTagLink(str: string) {
    let ele: TagDetails = this.tagDetailsArr.find((element: TagDetails) => element.key === str);
    let retVal = ele ? ele.link : '#';
    window.open(retVal, '_blank');
  }

  isExistsInPriceVol(val: string): boolean {
    if (this.priceVolCategoryArr && this.priceVolCategoryArr.length > 0) {
      for (let tag of this.priceVolCategoryArr) {
        if (tag.toLowerCase() == val.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  isExistsInClassification(val: string): boolean {
    if (this.classificationCategoryArr && this.classificationCategoryArr.length > 0) {
      for (let tag of this.classificationCategoryArr) {
        if (tag.toLowerCase() == val.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  isExistsInTechnical(val: string): boolean {
    if (this.technicalCategoryArr && this.technicalCategoryArr.length > 0) {
      for (let tag of this.technicalCategoryArr) {
        if (tag.toLowerCase() == val.toLowerCase()) {
          return true;
        }
      }
    }
    return false;
  }

  getTagDisplayText(str: string) {
    let ele: TagDetails = this.tagDetailsArr.find((element: TagDetails) => element.key === str);
    return ele ? ele.display : str;
  }

  updateUserDetails() {
    let formvalue = this.userProfileForm.value;
    // console.log(`formvalue: ${JSON.stringify(formvalue)}`);
    this.userProfileService.updateUserDetails(formvalue).subscribe((data) => {
      this.displayUpdatNotif = true;
    });
  }

  closeUpdateNotif() {
    this.displayUpdatNotif = false;
  }
}
