import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { ListDetailsRoutingModule } from './listDetails-routing.module';
import { ListDetailsComponent } from './listDetails.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ListDetailsRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
    SharedModule,
  ],
  declarations: [ListDetailsComponent],
})
export class ListDetailsModule {}
