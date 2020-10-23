import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Credentials, CredentialsService } from './credentials.service';

const routes = {
  login: () => `/login`,
};

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient, 
    private credentialsService: CredentialsService) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials | any> {
    // Replace by proper authentication call
    let loginData = {
      email: context.email,
      password: context.password
    };
    let headers = {
      contentType: 'application/json'
    };
    return this.httpClient.post(routes.login(), loginData, {
      headers: headers
    }).pipe(
      map((body: any)=>{
        console.log(`body: ${JSON.stringify(body)}`);
      this.credentialsService.setCredentials(body, context.remember);
      return of(body);
      }),
      catchError((err)=> {
        console.log(`err: ${JSON.stringify(err)}`);
        return throwError(err)
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
