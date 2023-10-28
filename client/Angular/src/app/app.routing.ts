import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_services/auth.guard';
import { AdminLayoutComponent } from './_components/layouts/admin-layout/admin-layout.component';
import { AdminLayoutModule } from './_components/layouts/admin-layout/admin-layout.module';
import { UserLoginModule } from './_components/user-login/user-login.module';
import { UserRegistrationModule } from './_components/user-registration/user-registration.module';
import { UserPasswordComponentModule } from './_components/password-recovery/user-password.module';
import { EmailComponent } from './_components/password-recovery/email/email.component';
import { AppComponent } from './app.component';
import {WriterApplicationComponent} from '../app/_components/writer-application/writer-application.component'
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./_components/user-login/user-login.module').then(m => m.UserLoginModule)
  },
  {
    path: 'registration',
    loadChildren:
      () => import('./_components/user-registration/user-registration.module').then(m => m.UserRegistrationModule)
  },
  
  {
    path: 'password-recovery',
    loadChildren:
      () => import('./_components/password-recovery/user-password.module').then(m => m.UserPasswordComponentModule)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren:
          () => import('./_components/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },
  { path: 'app', component: AppComponent },
  { path: 'writer_application', component: WriterApplicationComponent},
  { path: 'recovery', component: EmailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }), MatButtonToggleModule],
  exports: []
})
export class AppRoutingModule { }
