import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { map, catchError } from 'rxjs/operators';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    this.initForm();
    
    // get UserModelProfile
    this.authenticationService.getUserModelProfile().subscribe();

    // get date from config 
    this.webDisplayDate$ = this.authenticationService
    .getConfigValue('web_data_display_date')
    .pipe(
      map((body: any)=>{
        console.log(`getConfigValue body: ${JSON.stringify(body)}`);
        this.credentialsService.setWebDisplayDate(body.value_str);
        return body;
      }),
      catchError((err)=> {
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

  onSubmit(){
    console.log(`symbol: ${this.searchForm.value.symbol}`);
    if(this.searchForm.value.symbol){
      this.router.navigate(['/symbolDetails', this.searchForm.value.symbol], { replaceUrl: true });
    }
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      symbol: ['', Validators.required]
      });            
  }

  getJSONValue(obj:any){
    return JSON.stringify(obj);
  }
}
