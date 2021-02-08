import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { ListCardsRoutingModule } from './listCards-routing.module';
import { ListCardsComponent } from './listCards.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ListCardsRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
  ],
  declarations: [ListCardsComponent],
})
export class ListCardsModule {}
