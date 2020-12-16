import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { UserProfileComponent } from './userProfile.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'profile', component: UserProfileComponent, data: { title: marker('Liste.AI - User Profile') } }]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class UserProfileRoutingModule {}
