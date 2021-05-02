import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { AllUserListAdminComponent } from './allUserListAdmin.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'allUserListAdmin',
      component: AllUserListAdminComponent,
      data: { title: marker('Liste.AI - All Users (Admin View)') },
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AllUserListAdminRoutingModule {}
