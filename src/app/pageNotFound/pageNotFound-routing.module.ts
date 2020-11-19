import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { PageNotFoundComponent } from './pageNotFound.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'pageNotFound', component: PageNotFoundComponent, data: { title: marker('Liste.AI - PageNotFound') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PageNotFoundRoutingModule {}
