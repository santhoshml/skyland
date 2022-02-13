import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { UnsubscribeComponent } from './unsubscribe.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'unsubscribe/:userId', component: UnsubscribeComponent, data: { title: marker('Liste.AI - Unsubscribe') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class UnsubscribeRoutingModule {}
