import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, untilDestroyed, GoogleAnalyticsService } from '@core';
import { AuthenticationService } from './authentication.service';
import { Credentials } from './credentials.service';

import { SymbolDetailsService } from '../symbolDetails/symbolDetails.service';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

const log = new Logger('Login');

let infoWidgetOptions = {
  symbols: [
    {
      proName: 'FOREXCOM:SPXUSD',
      title: 'S&P 500',
    },
    {
      proName: 'FOREXCOM:NSXUSD',
      title: 'Nasdaq 100',
    },
    {
      description: 'DowJones',
      proName: 'FOREXCOM:DJI',
    },
    {
      description: 'TSLA',
      proName: 'NASDAQ:TSLA',
    },
    {
      description: 'MSFT',
      proName: 'NASDAQ:MSFT',
    },
    {
      description: 'FB',
      proName: 'FB',
    },
  ],
  showSymbolLogo: true,
  colorTheme: 'light',
  isTransparent: false,
  displayMode: 'adaptive',
  locale: 'en',
};

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
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService,
    private socialAuthService: SocialAuthService
  ) {
    this.activeTab = 'login';
    this.initForm();
  }

  ngOnInit() {
    console.log(`In login ngOnInit`);

    // this.socialAuthService.authState.subscribe((user) => {
    //   console.log(`user: ${JSON.stringify(user)}`);
    // });

    this.symbolDetailsService.loadTradingViewScript('tickerTapeWidget', 'embed-widget-ticker-tape', infoWidgetOptions);

    this.route.params.subscribe((params) => {
      // console.log(`params in params: ${JSON.stringify(params)}`);
      this.loginError = params['errMsg'];
    });

    // redirected from oauth
    this.route.queryParams.subscribe((params) => {
      // console.log(`params in queryParams : ${JSON.stringify(params)}`);
      let token = params['token'];
      let email = params['email'];
      let id = params['id'];
      if (token) {
        this.authenticationService.saveCredentianls(id, email, token);
        this.googleAnalyticsService.eventEmitter('redirectedt-login', 'login', 'redirected', 'redirected', 1, email);
        this.router.navigate(['/listCards'], { replaceUrl: true });
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
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
          this.googleAnalyticsService.eventEmitter(
            'login-successful',
            'login',
            'login-response',
            'login',
            1,
            credentials.email
          );

          // get favorites for the user
          this.authenticationService.getFavorites().subscribe();

          this.router.navigate(['/topPicks'], { replaceUrl: true });
          // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.loginError = `Email or password incorrect.`;
        }
      );
  }

  createAccount() {
    this.googleAnalyticsService.eventEmitter(
      'createAccount-called',
      'createAccount',
      'click',
      'createAccount',
      1,
      null
    );

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
          this.googleAnalyticsService.eventEmitter(
            'createAccount-successful',
            'createAccount',
            'createAccount-response',
            'createAccount',
            1,
            credentials.email
          );
          this.router.navigate(['/topPicks'], { replaceUrl: true });
          // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error: ${JSON.stringify(error)}`);
          if (error.error && error.error.errors) {
            this.createAccountError = error.error.errors;
          } else {
            this.createAccountError = `Email or password incorrect.`;
          }
          // console.log(`createAccountError : ${this.createAccountError}`);
        }
      );
  }

  forgotPassword() {}

  setActiveTab(val: string) {
    this.activeTab = val;
    this.initForm();
  }

  private initForm() {
    switch (this.activeTab) {
      case 'login':
        this.accountForm = this.formBuilder.group({
          displayName: [''],
          email: ['', Validators.required],
          password: ['', Validators.required],
          phone: [''],
          remember: true,
        });
        break;
      case 'createAccount':
        this.accountForm = this.formBuilder.group({
          displayName: ['', Validators.required],
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
