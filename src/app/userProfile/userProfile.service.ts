import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TagDetails, TagCategories } from './userProfile.component';

const routes = {
  tagCategories: () => `/data/tagCategories`,
  tagDetails: () => `/data/tags`,
};

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private httpClient: HttpClient) {}

  getTagCategories(): Observable<TagCategories[] | string> {
    return this.httpClient.get(routes.tagCategories()).pipe(
      map((body: TagCategories[]) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }

  getTagDetails() {
    return this.httpClient.get(routes.tagDetails()).pipe(
      map((body: Map<string, TagDetails[]>) => body),
      catchError(() => of('Error, could not GET tag details :-('))
    );
  }
}
