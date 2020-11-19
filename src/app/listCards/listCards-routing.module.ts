import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { ListCardsComponent } from './listCards.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'listCards', component: ListCardsComponent, data: { title: marker('Liste.AI - List Cards') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ListCardsRoutingModule {}
