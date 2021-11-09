import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { SharedModule } from '@app/@shared';

import { IndustryListRoutingModule } from './industryList-routing.module';
import { IndustryListComponent } from './industryList.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IndustryListRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
    SharedModule,
  ],
  declarations: [IndustryListComponent],
})
export class IndustryListModule {}
