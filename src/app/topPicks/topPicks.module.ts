import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { TopPicksRoutingModule } from './topPicks-routing.module';
import { TopPicksComponent } from './topPicks.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TopPicksRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
  ],
  declarations: [TopPicksComponent],
})
export class TopPicksModule {}
