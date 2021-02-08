import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// quote: () => `/data/prediction/groups`,
const routes = {
  startAnalysis: () => `/datafile`,
};

@Injectable({
  providedIn: 'root',
})
export class UploadPortfolioService {
  constructor(private httpClient: HttpClient) {}

  startUserAnalysis(): Observable<any> {
    return this.httpClient.post(routes.startAnalysis(), {
      withCredentials: true,
    });
  }
}
