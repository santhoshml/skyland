import { Component, OnInit, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { CredentialsService, UserProfileModel } from '@app/auth';
import { GoogleAnalyticsService } from '@app/@core';
import { ContactUsService } from './contactUs.service';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contactUs',
  templateUrl: './contactUs.component.html',
  styleUrls: ['./contactUs.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  displayThankYouMessage: boolean;

  constructor(
    private credentialsService: CredentialsService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private service: ContactUsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // initialse the form
    this.contactUsForm = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: [''],
      message: [''],
    });

    this.googleAnalyticsService.eventEmitter(
      'contactUs-init',
      'contactUs',
      'init',
      '',
      1,
      this.credentialsService.userEmail
    );
  }

  sendMessage() {
    let formvalue = this.contactUsForm.value;
    console.log(`formvalue: ${JSON.stringify(formvalue)}`);
    this.service.sendMessage(formvalue).subscribe((data) => {
      this.displayThankYouMessage = true;
    });
  }
}
