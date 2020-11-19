import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

const credentialsKey = 'credentials';
/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: environment.serverUrl + request.url });
    }

    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      let _credentials = JSON.parse(savedCredentials);
      let accessToken: string = _credentials.token;
      let userId: string = _credentials.id;

      // add token to the request
      if(request.url.endsWith('/portfolio')) {
        request = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${accessToken}`,
            'user-id'       : userId
          },
        });
      } else {
        request = request.clone({
          setHeaders: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'user-id'       : userId
          },
        });
      }
    }

    return next.handle(request);
  }
}
