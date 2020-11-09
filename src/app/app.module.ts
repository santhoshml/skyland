import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { UploadPortfolioModule } from './uploadPortfolio/uploadPortfolio.module';
import { ListCardsModule } from './listCards/listCards.module';
import { ListDetailsModule } from './listDetails/listDetails.module';
import { SymbolDetailsModule } from './symbolDetails/symbolDetails.module';
import { DefinitionsModule } from './definitions/definitions.module';
import { PageNotFoundModule } from './pageNotFound/pageNotFound.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { RoiDistributionModule } from './roiDistribution/roiDistribution.module';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AboutModule,
    AuthModule,
    UploadPortfolioModule,
    ListCardsModule,
    ListDetailsModule,
    SymbolDetailsModule,
    DefinitionsModule,
    PageNotFoundModule,
    RoiDistributionModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    TruncateModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
