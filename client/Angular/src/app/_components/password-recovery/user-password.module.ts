import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserPasswordComponentRoutes } from './user-password.routing';
import { UserPasswordComponent } from './user-password.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedService } from '../../_services/shared.service';
import { ComponentsModule } from '../components/components.module';
import { EmailComponent } from './email/email.component';
import { MaterialModule } from '../../_matrial';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    UserPasswordComponentRoutes,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule
  ],
  declarations: [UserPasswordComponent, EmailComponent],
  providers: [SharedService],
  exports: [UserPasswordComponent, EmailComponent]
})
export class UserPasswordComponentModule { }
