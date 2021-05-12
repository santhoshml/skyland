import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { SectorDetailsComponent } from './sectorDetails.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'sectorDetails/:key',
      component: SectorDetailsComponent,
      data: { title: marker('Liste.AI - Sector Details') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SectorDetailsRoutingModule {}
