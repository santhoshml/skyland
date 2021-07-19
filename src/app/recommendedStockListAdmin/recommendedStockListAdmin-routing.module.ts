import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { RecommendedStockListAdminComponent } from './recommendedStockListAdmin.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'recommendedStockListAdmin',
      component: RecommendedStockListAdminComponent,
      data: { title: marker('Liste.AI - Recommended Stock List (Admin View)') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RecommendedStockListAdminRoutingModule {}
