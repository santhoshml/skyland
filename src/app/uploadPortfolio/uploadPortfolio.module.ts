import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UploadPortfolioRoutingModule } from './uploadPortfolio-routing.module';
import { UploadPortfolioComponent } from './uploadPortfolio.component';

@NgModule({
  imports: [
    CommonModule, 
    TranslateModule, 
    UploadPortfolioRoutingModule, 
    BrowserModule, 
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule],
  declarations: [UploadPortfolioComponent],
})
export class UploadPortfolioModule {}
