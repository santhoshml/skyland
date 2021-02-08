import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { UserProfileRoutingModule } from './userProfile-routing.module';
import { UserProfileComponent } from './userProfile.component';

@NgModule({
  imports: [CommonModule, TranslateModule, UserProfileRoutingModule, BrowserModule, NgbModule, FileUploadModule],
  declarations: [UserProfileComponent],
})
export class UserProfileModule {}
