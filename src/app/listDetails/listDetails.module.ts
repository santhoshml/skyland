import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { ListDetailsRoutingModule } from './listDetails-routing.module';
import { ListDetailsComponent } from './listDetails.component';

@NgModule({
  imports: [CommonModule, TranslateModule, ListDetailsRoutingModule, BrowserModule, NgbModule, FileUploadModule],
  declarations: [ListDetailsComponent],
})
export class ListDetailsModule {}
