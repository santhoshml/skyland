import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { RecommendedStockListAdminRoutingModule } from './recommendedStockListAdmin-routing.module';
import { RecommendedStockListAdminComponent } from './recommendedStockListAdmin.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RecommendedStockListAdminRoutingModule,
    BrowserModule,
    NgbModule,
    FileUploadModule,
    SharedModule,
  ],
  declarations: [RecommendedStockListAdminComponent],
})
export class RecommendedStockListAdminModule {}
