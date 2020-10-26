import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { PageNotFoundRoutingModule } from './pageNotFound-routing.module';
import { PageNotFoundComponent } from './pageNotFound.component';

@NgModule({
  imports: [
    CommonModule, 
    TranslateModule, 
    PageNotFoundRoutingModule, 
    BrowserModule, 
    NgbModule,
    FileUploadModule],
  declarations: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
