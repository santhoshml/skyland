import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { AdminUsersDetailsRoutingModule } from './AdminUsersDetails-routing.module';
import { AdminUsersDetailsComponent } from './adminUsersDetails.component';
import { SharedModule } from '@app/@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AdminUsersDetailsRoutingModule,
    BrowserModule,
    NgbModule,
    FileUploadModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
  ],
  declarations: [AdminUsersDetailsComponent],
})
export class AdminUsersDetailsModule {}
