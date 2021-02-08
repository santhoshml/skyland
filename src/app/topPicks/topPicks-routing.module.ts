import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { TopPicksComponent } from './topPicks.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'topPicks', component: TopPicksComponent, data: { title: marker('Liste.AI - Top Picks') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class TopPicksRoutingModule {}
