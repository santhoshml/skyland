import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';

// { path: '', redirectTo: '/home', pathMatch: 'full' },
const routes: Routes = [
  Shell.childRoutes([{ path: 'home', component: HomeComponent, data: { title: marker('Liste.AI - Home') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class HomeRoutingModule {}
