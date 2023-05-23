import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { GuardLoginService } from './service/guard-login.service';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
const routes : Routes = [
  {
    path : '',
    component : HomeComponent
  },
  {
    path : 'se_connecter',
    component : LoginComponent
  },
  {
    path : 'mdp_oublier',
    component : ForgotPasswordComponent
  },
  {
    path : 'dashbord',
    loadChildren : ()=> import('./modules/dashbord/dashbord.module').then((m)=>m.DashbordModule),canActivate:[GuardLoginService]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports : [RouterModule]
})
export class AppRoutingModule { }
