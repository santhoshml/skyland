import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { UptrendingStocksComponent } from './uptrendingStocks.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'uptrendingStocks',
      component: UptrendingStocksComponent,
      data: { title: marker('Liste.AI - Uptrending Stocks') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class UptrendingStocksRoutingModule {}
