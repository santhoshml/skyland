import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { IndustryListComponent } from './industryList.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'industryList',
      component: IndustryListComponent,
      data: { title: marker('Liste.AI - Grouped by Industry') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class IndustryListRoutingModule {}
