import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { Shell } from '@app/shell/shell.service';
import { ContactUsComponent } from './contactUs.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'contactUs', component: ContactUsComponent, data: { title: marker('Liste.AI - Contact Us') } },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ContactUsRoutingModule {}
