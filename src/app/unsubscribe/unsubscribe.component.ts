import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { UnsubscribeService } from './unsubscribe.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnInit {
  radioItems: Array<string>;
  unsubscribeSuccess = false;
  feedback: string = '';
  model = { option: '' };
  userId: string;
  constructor(
    private service: UnsubscribeService,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute
  ) {
    this.radioItems = [
      'The email is not relevant to what I need.',
      'I am not in the stock market anymore',
      'For the time being, No.',
      'It could be later.',
    ];
    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });
  }

  ngOnInit(): void {}

  callUnsubscribe(): void {
    // this.credentialsService.credentials.id
    const reason = `Reason: ${this.model.option}, Feedback: ${this.feedback}`;
    this.service
      .unsubscribeEmail({
        userId: this.userId,
        message: reason,
      })
      .subscribe((res) => {
        this.unsubscribeSuccess = true;
      });
  }
}
