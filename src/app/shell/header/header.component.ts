import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { map, catchError } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '@app/userProfile/userProfile.service';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';

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
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  userModelProfile$: Observable<any>;
  webDisplayDate$: Observable<string>;
  userProfile$: Observable<any>;
  closeResult: string;
  userFeedback: string;
  showThankYouForFeedbackFlag = false;

  // searchbar in the header
  keyword = 'name';
  allSymbolData = [];
  data = [];
  history: string[] = [];
  isBackClicked = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private userProfileService: UserProfileService,
    private service: HeaderService,
    private modalService: NgbModal,
    private location: Location,
    private symbolDetailsService: SymbolDetailsService
  ) {}

  ngOnInit() {
    // get UserModelProfile
    this.authenticationService.getUserModelProfile().subscribe();

    // get date from config
    this.webDisplayDate$ = this.authenticationService.getConfigValue('web_data_display_date').pipe(
      map((body: any) => {
        // console.log(`getConfigValue body: ${JSON.stringify(body)}`);
        this.credentialsService.setWebDisplayDate(body.value_str);
        return body;
      }),
      catchError((err) => {
        // console.log(`err: ${JSON.stringify(err)}`);
        return of(null);
      })
    );

    this.service.getAllSymbols().subscribe((data) => {
      this.allSymbolData = data;
      this.data = data.slice(0, 15);
    });

    this.userProfile$ = this.userProfileService.getUserDetails();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.isBackClicked) {
          this.isBackClicked = false;
        } else {
          this.history.push(event.urlAfterRedirects);
        }
      }
    });
  }

  ngAfterContentInit() {
    console.log(`In ngAfterContentInit`);
    this.symbolDetailsService.loadTradingViewScript(
      'tickerTapeWidgetHeader',
      'embed-widget-ticker-tape',
      infoWidgetOptions
    );
  }

  backClicked() {
    const url = this.history[this.history.length - 2];
    this.history.pop();
    this.isBackClicked = true;
    if (this.history.length > 0) {
      this.router.navigateByUrl(url);
    } else {
      this.router.navigateByUrl('/topPicks');
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  profile() {
    this.router.navigate(['/profile'], { replaceUrl: true });
  }

  distributions() {
    this.router.navigate(['/distribution'], { replaceUrl: true });
  }

  displayAllUsers() {
    this.router.navigate(['/allUserListAdmin'], { replaceUrl: true });
  }

  displayAdminControls() {
    this.router.navigate(['/adminControls'], { replaceUrl: true });
  }

  displayTopStocksFromPast() {
    this.router.navigate(['/recommendedStockListAdmin'], { replaceUrl: true });
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get email(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.email : null;
  }

  getJSONValue(obj: any) {
    return JSON.stringify(obj);
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        const credentials = this.credentialsService.credentials;
        let userId = credentials ? credentials.id : null;
        let email = credentials ? credentials.email : null;
        let data = {
          comments: this.userFeedback,
          userId: userId,
          email: email,
          url: this.router.url,
        };
        this.service.recordUserFeedback(data).subscribe((dt) => {
          this.showThankYouForFeedbackFlag = true;
        });
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  closeThankYouForFeedbackAlert() {
    this.showThankYouForFeedbackFlag = false;
  }

  selectEvent(item) {
    // do something with selected item
    console.log(`In selectEvent, ${JSON.stringify(item)}`);
    if (item) {
      this.router.navigate(['/symbolDetails', item.id], { replaceUrl: true });
    }
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    if (!val || val.length === 0 || !this.allSymbolData) {
      return [];
    } else {
      let filteredList = [];
      let filteredSymbol = [];
      let filteredMatchingSymbol = [];
      let str = val.toLowerCase();
      for (let ele of this.allSymbolData) {
        const symbol = ele.id.toLowerCase();
        const name = ele.name.toLowerCase().split(symbol)[1];
        if (symbol === str) {
          filteredSymbol.push(ele);
        } else if (symbol.includes(str)) {
          filteredMatchingSymbol.push(ele);
        } else if (name.includes(str)) {
          filteredList.push(ele);
        }
      }
      this.data = [...filteredSymbol, ...filteredMatchingSymbol, ...filteredList];
    }
  }

  clearFilter(e) {
    this.data = this.allSymbolData.slice(0, 15);
  }
}
