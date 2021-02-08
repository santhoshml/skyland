import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { UploadPortfolioComponent } from './uploadPortfolio.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'uploadPortfolio',
      component: UploadPortfolioComponent,
      data: { title: marker('Liste.AI - Upload Portfolio') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class UploadPortfolioRoutingModule {}
