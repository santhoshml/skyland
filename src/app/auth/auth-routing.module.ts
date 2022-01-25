import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { LoginComponent } from './login.component';

const routes: Routes = [
  { path: '', redirectTo: '/topPicks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { title: marker('Login') } },
  { path: 'signup', component: LoginComponent, data: { title: marker('Create Account') } },
  { path: 'forgotPassword', component: LoginComponent, data: { title: marker('Forgot Password') } },
  { path: 'resetPassword', component: LoginComponent, data: { title: marker('Reset Password') } },
  { path: 'login/token/:token', component: LoginComponent, data: { title: marker('Liste.AI - Login') } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule {}
