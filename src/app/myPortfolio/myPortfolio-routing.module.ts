import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { MyPortfolioComponent } from './myPortfolio.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'myPortfolio', component: MyPortfolioComponent, data: { title: marker('Liste.AI - My Portfolio') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class MyPortfolioRoutingModule {}
