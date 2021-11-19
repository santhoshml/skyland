import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { IndustryListModule } from './industryList/industryList.module';
import { ListDetailsModule } from './listDetails/listDetails.module';
import { SubSectorDetailsModule } from './subSectorDetails/subSectorDetails.module';
import { SectorDetailsModule } from './sectorDetails/sectorDetails.module';
import { SymbolDetailsModule } from './symbolDetails/symbolDetails.module';
import { DefinitionsModule } from './definitions/definitions.module';
import { UserProfileModule } from './userProfile/userProfile.module';
import { AllUserListAdminModule } from './allUserListAdmin/allUserListAdmin.module';
import { AdminControlsModule } from './adminControls/adminControls.module';
import { RecommendedStockListAdminModule } from './recommendedStockListAdmin/recommendedStockListAdmin.module';
import { PageNotFoundModule } from './pageNotFound/pageNotFound.module';
import { TopPicksModule } from './topPicks/topPicks.module';
import { SectorListModule } from './sectorList/sectorList.module';
import { UptrendingStocksModule } from './uptrendingStocks/uptrendingStocks.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { RoiDistributionModule } from './roiDistribution/roiDistribution.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GaugeChartModule } from 'angular-gauge-chart';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    IndustryListModule,
    ListDetailsModule,
    SymbolDetailsModule,
    UserProfileModule,
    DefinitionsModule,
    PageNotFoundModule,
    TopPicksModule,
    SectorListModule,
    UptrendingStocksModule,
    SubSectorDetailsModule,
    SectorDetailsModule,
    RoiDistributionModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    TruncateModule,
    GaugeChartModule,
    SocialLoginModule,
    AllUserListAdminModule,
    AdminControlsModule,
    RecommendedStockListAdminModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '54409379898-e2l76l8jtmdukd8gf0ar4cilrh5hpuj3.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
