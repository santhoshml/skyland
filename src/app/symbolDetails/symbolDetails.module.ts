import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SymbolDetailsRoutingModule } from './symbolDetails-routing.module';
import { SymbolDetailsComponent } from './symbolDetails.component';

import { GaugeChartModule } from 'angular-gauge-chart';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SymbolDetailsRoutingModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TruncateModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    GaugeChartModule,
    FileUploadModule,
  ],
  declarations: [SymbolDetailsComponent],
})
export class SymbolDetailsModule {}
