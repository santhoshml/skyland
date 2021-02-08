import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { RoiDistributionRoutingModule } from './roiDistribution-routing.module';
import { RoiDistributionComponent } from './roiDistribution.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RoiDistributionRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    FileUploadModule,
  ],
  declarations: [RoiDistributionComponent],
})
export class RoiDistributionModule {}
