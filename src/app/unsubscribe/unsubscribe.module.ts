import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { UnsubscribeRoutingModule } from './unsubscribe-routing.module';
import { UnsubscribeComponent } from './unsubscribe.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    UnsubscribeRoutingModule,
    BrowserModule,
    NgbModule,
    FileUploadModule,
  ],
  declarations: [UnsubscribeComponent],
})
export class UnsubscribeModule {}
