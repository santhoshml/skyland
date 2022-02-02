import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { map, catchError, ignoreElements } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '@app/userProfile/userProfile.service';
import { SymbolDetailsService } from '@app/symbolDetails/symbolDetails.service';
import { MyPortfolioService } from '@app/myPortfolio/myPortfolio.service';

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
  portfolioValue = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private userProfileService: UserProfileService,
    private service: HeaderService,
    private modalService: NgbModal,
    private location: Location,
    private symbolDetailsService: SymbolDetailsService,
    private portFolioService: MyPortfolioService
  ) {}

  ngOnInit() {
    // get UserModelProfile
    // this.authenticationService.getUserModelProfile().subscribe();
    this.getPortFolioValue();

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
      // this.data = data;
    });

    if (this.credentialsService.credentials) {
      this.userProfile$ = this.userProfileService.getUserDetails();
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.isBackClicked) {
          this.isBackClicked = false;
        } else {
          this.history.push(event.urlAfterRedirects);
        }
      }
    });

    this.userProfileService.triggerUserDetails.subscribe(() => {
      this.userProfile$ = this.userProfileService.getUserDetails();
    });
  }

  ngOnDestroy() {
    this.userProfileService.triggerUserDetails.unsubscribe();
  }

  ngAfterContentInit() {
    // console.log(`In ngAfterContentInit`);
    this.symbolDetailsService.loadTradingViewScript(
      'tickerTapeWidgetHeader',
      'embed-widget-ticker-tape',
      infoWidgetOptions
    );
  }

  getPortFolioValue() {
    if (this.credentialsService.credentials) {
      this.portFolioService.getOpenPositions().subscribe((res) => {
        let pfValue = 0;
        res.forEach((val) => {
          pfValue = pfValue + (val.buy_qty - val.sell_qty);
          console.log(pfValue);
        });
        this.portfolioValue = pfValue;
      });
    }
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
    this.userProfileService.triggerUserDetails.next(true);
    this.authenticationService.logout().subscribe(() => this.router.navigate([''], { replaceUrl: true }));
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
          userId: userId || 'Anonymous',
          email: email || 'Anonymous',
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

  searchStr = '';
  onChangeSearch(val: string) {
    let startTime = new Date().getTime();
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    // console.log(`val : ${val}`);

    if (!val || val.length === 0 || !this.allSymbolData) {
      this.searchStr = '';
      return [];
    } else {
      let str = val.toLowerCase();
      if (str != this.searchStr) {
        let filteredList = [];
        let filteredNameStartsWithList = [];
        let filteredSymbol = [];
        let filteredSymbolStartsWith = [];
        let filteredMatchingSymbol = [];

        let initialArr = this.data;
        if (!this.searchStr || this.searchStr.length === 0 || (str && str.length < this.searchStr.length)) {
          initialArr = this.allSymbolData;
        }

        for (let ele of initialArr) {
          const len = str.length;
          const symbol = len <= 6 ? ele.id.toLowerCase().trim() : null;
          const name = ele.name.toLowerCase().split('-')[1].trim();

          if (len <= 6 && symbol === str) {
            filteredSymbol.push(ele);
          } else if (len <= 6 && symbol.startsWith(str)) {
            filteredSymbolStartsWith.push(ele);
          } else if (len <= 6 && symbol.includes(str)) {
            filteredMatchingSymbol.push(ele);
          } else if (name.startsWith(str)) {
            filteredNameStartsWithList.push(ele);
          } else if (name.includes(str)) {
            filteredList.push(ele);
          }
        }
        this.searchStr = str;

        this.data = [
          ...filteredSymbol,
          ...filteredSymbolStartsWith,
          ...filteredMatchingSymbol,
          ...filteredNameStartsWithList,
          ...filteredList,
        ];

        let endTime = new Date().getTime();
        console.log(`time for search  : ${endTime - startTime} ms`);
      }
    }
  }

  clearFilter(e) {
    this.data = this.allSymbolData.slice(0, 15);
  }
}
