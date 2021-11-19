import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { AdminControlsComponent } from './adminControls.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'adminControls',
      component: AdminControlsComponent,
      data: { title: marker('Liste.AI - Admin Controls') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminControlsRoutingModule {}
