import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { map, catchError } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  searchForm!: FormGroup;
  userModelProfile$: Observable<any>;
  webDisplayDate$: Observable<string>;
  closeResult: string;
  userFeedback: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private service: HeaderService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.initForm();

    // get UserModelProfile
    this.authenticationService.getUserModelProfile().subscribe();

    // get date from config
    this.webDisplayDate$ = this.authenticationService.getConfigValue('web_data_display_date').pipe(
      map((body: any) => {
        console.log(`getConfigValue body: ${JSON.stringify(body)}`);
        this.credentialsService.setWebDisplayDate(body.value_str);
        return body;
      }),
      catchError((err) => {
        console.log(`err: ${JSON.stringify(err)}`);
        return of(null);
      })
    );

    // .pipe(
    //   map(())
    // )
    // .subscribe(data=>{
    //   console.log(`web_data_display_date, ${JSON.stringify(data)}`);
    //   this.webDisplayDate = data.value_str;
    // });
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  distributions() {
    this.router.navigate(['/distribution'], { replaceUrl: true });
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get email(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.email : null;
  }

  onSubmit() {
    console.log(`symbol: ${this.searchForm.value.symbol}`);
    if (this.searchForm.value.symbol) {
      this.router.navigate(['/symbolDetails', this.searchForm.value.symbol], { replaceUrl: true });
    }
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      symbol: ['', Validators.required],
    });
  }

  getJSONValue(obj: any) {
    return JSON.stringify(obj);
  }

  emojiClick(value:string){
    console.log(`In emojiClick: ${value}`);
    const credentials = this.credentialsService.credentials;
    let userId = credentials ? credentials.id: null;
    let email = credentials ? credentials.email: null;
    let data = {
      userId: userId,
      email: email,
      value: value,
      url: this.router.url
    };
    this.service.updateEmojiValue(data).subscribe();
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        const credentials = this.credentialsService.credentials;
        let userId = credentials ? credentials.id: null;
        let email = credentials ? credentials.email: null;    
        let data = {
          comments: this.userFeedback,
          userId: userId,
          email: email,
          url: this.router.url
        };
        this.service.recordUserFeedback(data).subscribe();
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
}
