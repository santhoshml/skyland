import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { SharedModule } from '@app/@shared';
import { SectorDetailsRoutingModule } from './sectorDetails-routing.module';
import { SectorDetailsComponent } from './sectorDetails.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SectorDetailsRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
    SharedModule,
  ],
  declarations: [SectorDetailsComponent],
})
export class SectorDetailsModule {}
