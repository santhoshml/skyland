import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { BetterPerformingComponent } from './betterPerforming.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'betterPerforming',
      component: BetterPerformingComponent,
      data: { title: marker('Liste.AI - Stocks that performace better than NASDAQ and are in Uptrend') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class BetterPerformingRoutingModule {}
