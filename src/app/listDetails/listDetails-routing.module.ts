import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { ListDetailsComponent } from './listDetails.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'listDetails/:listId', component: ListDetailsComponent, data: { title: marker('Liste.AI - List Details') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ListDetailsRoutingModule {}
