import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { map, catchError } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileService } from '@app/userProfile/userProfile.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private userProfileService: UserProfileService,
    private service: HeaderService,
    private modalService: NgbModal
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
  }

  ngAfterContentInit() {
    console.log(`In ngAfterContentInit`);
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  distributions() {
    this.router.navigate(['/distribution'], { replaceUrl: true });
  }

  displayAllUsers() {
    this.router.navigate(['/allUserListAdmin'], { replaceUrl: true });
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

  emojiClick(value: string): boolean {
    // console.log(`In emojiClick: ${value}`);
    const credentials = this.credentialsService.credentials;
    let userId = credentials ? credentials.id : null;
    let email = credentials ? credentials.email : null;
    let data = {
      userId: userId,
      email: email,
      value: value,
      url: this.router.url,
    };
    this.service.updateEmojiValue(data).subscribe((data) => {
      this.showThankYouForFeedbackFlag = true;
    });
    return true;
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
    console.log(`In onChangeSearch, ${JSON.stringify(val)}`);
    let filteredList = [];
    if (!val || val.length === 0 || !this.allSymbolData) {
      return [];
    } else {
      console.log(`this.allSymbolData length : ${this.allSymbolData.length}`);
      let str = val.toLowerCase();
      console.log(`ste:${str}`);
      for (let ele of this.allSymbolData) {
        if (ele.name.toLowerCase().includes(str)) {
          filteredList.push(ele);
        }
        if (filteredList.length >= 15) {
          this.data = filteredList;
        }
      }
      this.data = filteredList;
    }
  }

  onFocused(e) {
    // do something when input is focused
    console.log(`In onFocused, ${JSON.stringify(e)}`);
  }
}
