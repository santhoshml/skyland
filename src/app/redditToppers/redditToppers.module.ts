import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { RedditToppersRoutingModule } from './redditToppers-routing.module';
import { RedditToppersComponent } from './redditToppers.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RedditToppersRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
    SharedModule,
  ],
  declarations: [RedditToppersComponent],
})
export class RedditToppersModule {}
