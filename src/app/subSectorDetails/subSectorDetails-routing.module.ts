import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { SubSectorDetailsComponent } from './subSectorDetails.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'subSectorDetails/:key',
      component: SubSectorDetailsComponent,
      data: { title: marker('Liste.AI - Sub-Sector Details') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SubSectorDetailsRoutingModule {}
