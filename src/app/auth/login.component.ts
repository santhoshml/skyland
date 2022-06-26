import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, untilDestroyed, GoogleAnalyticsService } from '@core';
import { AuthenticationService } from './authentication.service';
import { Credentials } from './credentials.service';

import { SymbolDetailsService } from '../symbolDetails/symbolDetails.service';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '@app/userProfile/userProfile.service';

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
  @Input() isModalLogin: boolean;
  version: string | null = environment.version;

  loginError: string | undefined;
  createAccountError: string | undefined;
  forgotError: string | undefined;
  resetError: string | undefined;
  accountForm!: FormGroup;
  isLoading = false;
  redirectUrl: string = '/topPicks';
  containerView = {
    login: false,
    signUp: false,
    forgotPassword: false,
    resetPassword: false,
  };
  resetPasswordInfo = true;
  enableWidgetContainer = false;

  refferedByList = ['Google', 'Facebook', 'Twitter', 'Instagram', 'Sacramento State University', 'UC Davis', 'Reditt'];
  referredByStr = 'Referred by';
  refferedByVal = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private symbolDetailsService: SymbolDetailsService,
    private socialAuthService: SocialAuthService,
    private modalService: NgbModal,
    private userProfileService: UserProfileService
  ) {
    if (this.router.url === '/signup') {
      this.containerView.signUp = true;
      this.initForm('createAccount');
    } else if (this.router.url === '/forgotPassword') {
      this.containerView.forgotPassword = true;
      this.initForm('forgotPassword');
    } else if (this.router.url === '/resetPassword') {
      this.containerView.resetPassword = true;
      this.initForm('resetPassword');
    } else {
      this.containerView.login = true;
      this.initForm('login');
    }
  }

  ngOnInit() {
    // this.socialAuthService.authState.subscribe((user) => {
    //   console.log(`user: ${JSON.stringify(user)}`);
    // });

    this.refferedByVal = this.referredByStr;
    this.symbolDetailsService.loadTradingViewScript('tickerTapeWidget', 'embed-widget-ticker-tape', infoWidgetOptions);

    this.route.params.subscribe((params) => {
      this.loginError = params['errMsg'];
    });

    // redirected from oauth
    this.route.queryParams.subscribe((params) => {
      // console.log(`params in queryParams : ${JSON.stringify(params)}`);
      let token = params['token'];
      let email = params['email'];
      let id = params['id'];
      if (params.redirect) {
        this.redirectUrl = params.redirect;
      }
      if (token) {
        this.authenticationService.saveCredentianls(id, email, token);
        this.googleAnalyticsService.eventEmitter('redirectedt-login', 'login', 'redirected', 'redirected', 1, email);
        this.router.navigate(['/listCards'], { replaceUrl: true });
      }
    });
    this.enableWidgetContainer = this.isModalLogin || false;
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

  closePopup() {
    this.modalService.dismissAll();
  }

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
          this.closePopup();
          this.userProfileService.triggerUserDetails.next(true);
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

          this.router.navigate([this.redirectUrl], { replaceUrl: true });
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
    let refVal = this.refferedByVal === this.referredByStr ? null : this.refferedByVal;
    const login$ = this.authenticationService.createAccount(this.accountForm.value, refVal);
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
          this.router.navigate([this.redirectUrl], { replaceUrl: true });
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

  forgotPassword() {
    this.googleAnalyticsService.eventEmitter(
      'forgotPassword-called',
      'forgotPassword',
      'click',
      'forgotPassword',
      1,
      null
    );
    this.isLoading = true;
    this.forgotError = undefined;
    const forgotPassword$ = this.authenticationService.forgotPassword(this.accountForm.value);
    forgotPassword$
      .pipe(
        finalize(() => {
          this.accountForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials: Credentials) => {
          log.debug(`new code sent to ${credentials.email} successfully`);
          this.googleAnalyticsService.eventEmitter(
            'forgotPassword-successful',
            'forgotPassword',
            'forgotPassword-response',
            'forgotPassword',
            1,
            credentials.email
          );
          this.router.navigate(['/resetPassword'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`forgotError : ${JSON.stringify(error)}`);
          if (error.error && error.error.errors) {
            this.forgotError = error.error.errors;
          } else {
            this.forgotError = `Email is incorrect or does not exist in our system.`;
          }
        }
      );
  }

  resetPassword() {
    this.isLoading = true;
    this.resetError = undefined;
    this.resetPasswordInfo = false;
    const resetPassword$ = this.authenticationService.resetPassword(this.accountForm.value);
    resetPassword$
      .pipe(
        finalize(() => {
          this.accountForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials: Credentials) => {
          log.debug(`new password sent to ${credentials.email} successfully`);
          this.googleAnalyticsService.eventEmitter(
            'resetPassword-successful',
            'resetPassword',
            'resetPassword-response',
            'resetPassword',
            1,
            credentials.email
          );
          this.router.navigate([this.redirectUrl], { replaceUrl: true });
        },
        (error) => {
          log.debug(`forgotError : ${JSON.stringify(error)}`);
          if (error.error && error.error.errors) {
            this.resetError = error.error.errors;
          } else {
            this.resetError = 'Please verify the code or password fields';
          }
        }
      );
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirm').value;
    return pass.includes(confirmPass) ? null : { notSame: true };
  };

  private initForm(type: string) {
    switch (type) {
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
          phone: ['', Validators.required],
          remember: true,
        });
        break;
      case 'forgotPassword':
        this.accountForm = this.formBuilder.group({
          email: ['', Validators.required],
        });
        break;
      case 'resetPassword':
        this.accountForm = this.formBuilder.group(
          {
            code: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirm: ['', [Validators.required, Validators.minLength(8)]],
          },
          { validators: this.checkPasswords }
        );
        break;
      default:
        break;
    }
  }

  selectRefValue(val: string) {
    this.refferedByVal = val;
  }
}
