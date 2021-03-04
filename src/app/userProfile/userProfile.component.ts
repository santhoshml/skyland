import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { UserProfileService } from './userProfile.service';

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

  constructor(
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    // get tag categories
    this.userProfileService.getTagCategories().subscribe((data: TagCategories[]) => {
      this.googleAnalyticsService.eventEmitter(
        'userProfile-init',
        'userProfile',
        'init',
        'getTagCategories',
        1,
        this.credentialsService.credentials.id
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
        this.credentialsService.credentials.id
      );
      this.tagDetailsMap = data;
      for (const [key, value] of Object.entries(this.tagDetailsMap)) {
        this.tagDetailsArr = this.tagDetailsArr.concat(value);
      }
    });

    // set user profile
    this.userProfile = this.credentialsService.userProfileModel;
    // console.log(`this.userProfile : ${JSON.stringify(this.userProfile)}`);
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
}
