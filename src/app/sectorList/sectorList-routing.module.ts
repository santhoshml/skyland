import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { SectorListComponent } from './sectorList.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'sectorList', component: SectorListComponent, data: { title: marker('Liste.AI - Grouped by Sector') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SectorListRoutingModule {}
