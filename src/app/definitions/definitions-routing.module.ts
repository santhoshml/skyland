import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { DefinitionsComponent } from './definitions.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'definitions', component: DefinitionsComponent, data: { title: marker('Definitions') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class DefinitionsRoutingModule {}
