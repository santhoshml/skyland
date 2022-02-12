import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  contactUs: () => `/contactUs/message`,
};

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  sendMessage(data: any) {
    return this.httpClient.post(routes.contactUs(), data, { withCredentials: true }).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not POST userDeatils details :-('))
    );
  }
  constructor(private httpClient: HttpClient) {}
}
