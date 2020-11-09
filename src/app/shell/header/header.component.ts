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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.userModelProfile$ = this.authenticationService.getUserModelProfile().pipe(
      map((body: any, headers:any)=>{
        console.log(`body from headerComponent, body: ${JSON.stringify(body)}`);
        this.credentialsService.setUserProfile(body);
        return body;
      }),
      catchError((err)=>{
        console.log(`Error when getting userModel profile: ${JSON.stringify(err)}`);
        return of(false);
      })
    )
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
}
