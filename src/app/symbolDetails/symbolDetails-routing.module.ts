import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { SymbolDetailsComponent } from './symbolDetails.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'symbolDetails/:symbol', component: SymbolDetailsComponent, data: { title: marker('Symbol Details') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SymbolDetailsRoutingModule {}
