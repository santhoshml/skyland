import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { DefinitionsRoutingModule } from './definitions-routing.module';
import { DefinitionsComponent } from './definitions.component';

@NgModule({
  imports: [CommonModule, TranslateModule, DefinitionsRoutingModule, BrowserModule, NgbModule, FileUploadModule],
  declarations: [DefinitionsComponent],
})
export class DefinitionsModule {}
