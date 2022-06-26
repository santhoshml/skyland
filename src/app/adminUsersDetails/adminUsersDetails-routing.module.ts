import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Shell } from '@app/shell/shell.service';
import { AdminUsersDetailsComponent } from './adminUsersDetails.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'adminUsersDetails/:email',
      component: AdminUsersDetailsComponent,
      data: { title: marker('Liste.AI - Admin User Details') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminUsersDetailsRoutingModule {}
