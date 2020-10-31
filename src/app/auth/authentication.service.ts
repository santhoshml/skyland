import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Credentials, CredentialsService } from './credentials.service';

const routes = {
  login: () => `/login`,
  createAccount: () => `/signup`,
  userModelStats: () => `/model/info` 
};

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}

export interface CreateAccountContext {
  email: string;
  password: string;
  phone: string;
  displayName: string;
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

  saveCredentianls(id:string, email:string, token:string) : void {
    this.credentialsService.setCredentials({
      email: email,
      token: token,
      id: id
    }, true);
  }  

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
   * Create Account for the user.
   * @param context The CreateAccountContext parameters.
   * @return The user credentials.
   */
  createAccount(context: CreateAccountContext): Observable<Credentials | any> {
    // Replace by proper authentication call
    let createAccountData = {
      email: context.email,
      password: context.password,
      displayName: context.displayName,
      phone: context.phone
    };
    return this.httpClient.post(routes.createAccount(), createAccountData).pipe(
      map((body: any)=>{
        console.log(`body: ${JSON.stringify(body)}`);
      this.credentialsService.setCredentials(body, false);
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

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  getUserModelProfile(): Observable<any> {
    // Replace by proper authentication call
    let headers = {
      contentType: 'application/json'
    };
    return this.httpClient.get(routes.userModelStats(), {
      headers: headers
    });
    
    // .pipe(
    //   map((body: any)=>{
    //     console.log(`getUserModelProfile body: ${JSON.stringify(body)}`);
    //     return of(body);
    //   }),
    //   catchError((err)=> {
    //     console.log(`err: ${JSON.stringify(err)}`);
    //     return throwError(err)
    //   })
    // );


  }  
}
