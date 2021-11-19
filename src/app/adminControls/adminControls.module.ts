import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { AdminControlsRoutingModule } from './AdminControls-routing.module';
import { AdminControlsComponent } from './adminControls.component';
import { SharedModule } from '@app/@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AdminControlsRoutingModule,
    BrowserModule,
    NgbModule,
    FileUploadModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
  ],
  declarations: [AdminControlsComponent],
})
export class AdminControlsModule {}
