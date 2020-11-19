import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { RoiDistributionComponent } from './roiDistribution.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'distribution', component: RoiDistributionComponent, data: { title: marker('Liste.AI - ROI distibution') } }]),
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [],
})
export class RoiDistributionRoutingModule {}
