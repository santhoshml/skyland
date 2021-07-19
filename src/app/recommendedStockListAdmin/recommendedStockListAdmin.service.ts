import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  topStocksHistory: () => `/stocks/topStocksPerf`,
};

@Injectable({
  providedIn: 'root',
})
export class RecommendedStockListAdminService {
  constructor(private httpClient: HttpClient) {}

  getAllReccomendedStocksList(): Observable<any> {
    return this.httpClient.get(routes.topStocksHistory()).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not GET topStocksHistory details :-('))
    );
  }
}
