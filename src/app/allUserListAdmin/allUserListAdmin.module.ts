import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { AllUserListAdminRoutingModule } from './allUserListAdmin-routing.module';
import { AllUserListAdminComponent } from './allUserListAdmin.component';

@NgModule({
  imports: [CommonModule, TranslateModule, AllUserListAdminRoutingModule, BrowserModule, NgbModule, FileUploadModule],
  declarations: [AllUserListAdminComponent],
})
export class AllUserListAdminModule {}
