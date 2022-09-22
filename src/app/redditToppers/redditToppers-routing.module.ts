import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { RedditToppersComponent } from './redditToppers.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'redditToppers',
      component: RedditToppersComponent,
      data: { title: marker('Liste.AI - Reddit Hotties') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RedditToppersRoutingModule {}
