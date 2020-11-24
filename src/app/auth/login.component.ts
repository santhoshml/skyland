import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, untilDestroyed, GoogleAnalyticsService } from '@core';
import { AuthenticationService } from './authentication.service';
import { Credentials } from './credentials.service';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  
  loginError: string | undefined;
  createAccountError: string | undefined;
  forgotError: string | undefined;

  accountForm!: FormGroup;

  activeTab: string;
  
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.activeTab = 'login';
    this.initForm();
  }

  ngOnInit() {
    console.log(`In login ngOnInit`);
    this.route.params.subscribe(params=>{
      console.log(`params in params: ${JSON.stringify(params)}`);
      this.loginError = params['errMsg'];
    });

    // redirected from oauth
    this.route.queryParams.subscribe(params => {
        console.log(`params in queryParams : ${JSON.stringify(params)}`);
        let token = params['token'];
        let email = params['email'];
        let id = params['id'];
        if(token){
          this.authenticationService.saveCredentianls(id, email, token);
          this.googleAnalyticsService.eventEmitter("redirectedt-login", "login", "redirected", "redirected", 1, id);
          this.router.navigate(['/listCards'], { replaceUrl: true });
        }
    });
  }

  ngOnDestroy() {}

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.accountForm.value);
    login$
      .pipe(
        finalize(() => {
          this.accountForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials: any) => {
          this.googleAnalyticsService.eventEmitter("login-successful", "login", "login-response", "login", 1, credentials.id);

          // get favorites for the user
          this.authenticationService.getFavorites().subscribe();

          this.router.navigate(['/listCards'], { replaceUrl: true });
          // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.loginError = `Email or password incorrect.`;
        }
      );
  }

  createAccount() {
    this.googleAnalyticsService.eventEmitter("createAccount-called", "createAccount", "click", "createAccount", 1, null);

    this.isLoading = true;
    const login$ = this.authenticationService.createAccount(this.accountForm.value);
    login$
      .pipe(
        finalize(() => {
          this.accountForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials: Credentials) => {
          log.debug(`${credentials.email} successfully logged in`);
          this.googleAnalyticsService.eventEmitter("createAccount-successful", "createAccount", "createAccount-response", "createAccount", 1, credentials.id);
          this.router.navigate(['/uploadPortfolio'], { replaceUrl: true });
          // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.loginError = `Email or password incorrect.`;
        }
      );
  }

  forgotPassword() {

  }

  setActiveTab(val: string){
    this.activeTab = val;
    this.initForm();
  }

  private initForm() {
    switch (this.activeTab) {
      case 'login':
        this.accountForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required],
          phone: [''],
          remember: true,
        });            
        break;
      case 'createAccount':
        this.accountForm = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required],
          phone: [''],
          remember: true,
        });            
        break;
    
      default:
        break;
    }

  }
}
