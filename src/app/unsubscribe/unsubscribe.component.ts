import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { UnsubscribeService } from './unsubscribe.service';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnInit {
  unsubscribeForm: FormGroup;
  displayThankYouMessage: boolean;
  private sub: any;
  userId: string;

  constructor(
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private service: UnsubscribeService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // initialse the form
    this.unsubscribeForm = this.formBuilder.group({
      message: [''],
    });

    this.googleAnalyticsService.eventEmitter(
      'unsubscribe-init',
      'unsubscribe',
      'init',
      '',
      1,
      this.credentialsService.userEmail
    );

    this.sub = this.route.params.subscribe((params) => {
      this.userId = params['userId'];
    });
  }

  unsubscribe() {
    let formvalue = this.unsubscribeForm.value;
    console.log(`formvalue: ${JSON.stringify(formvalue)}`);
    let data = {
      userId: this.userId,
      message: formvalue.message,
    };
    this.service.unsubscribe(data).subscribe((resp) => {
      this.displayThankYouMessage = true;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
