import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { MyPortfolioRoutingModule } from './myPortfolio-routing.module';
import { MyPortfolioComponent } from './myPortfolio.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MyPortfolioRoutingModule,
    BrowserModule,
    NgbModule,
    TruncateModule,
    FileUploadModule,
    AutocompleteLibModule,
    SharedModule,
  ],
  declarations: [MyPortfolioComponent],
})
export class MyPortfolioModule {}
