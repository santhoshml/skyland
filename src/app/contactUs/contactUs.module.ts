import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { ContactUsRoutingModule } from './contactUs-routing.module';
import { ContactUsComponent } from './contactUs.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ContactUsRoutingModule,
    BrowserModule,
    NgbModule,
    FileUploadModule,
  ],
  declarations: [ContactUsComponent],
})
export class ContactUsModule {}
