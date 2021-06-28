import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { SubSectorDetailsRoutingModule } from './subSectorDetails-routing.module';
import { SubSectorDetailsComponent } from './subSectorDetails.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SubSectorDetailsRoutingModule,
    BrowserModule,
    NgbModule,
    FileUploadModule,
    TruncateModule,
    SharedModule,
  ],
  declarations: [SubSectorDetailsComponent],
})
export class SubSectorDetailsModule {}
