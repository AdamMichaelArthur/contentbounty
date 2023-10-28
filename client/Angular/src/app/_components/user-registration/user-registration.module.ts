import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { UserRegistrationRoutes } from './user-registration.routing';
import { UserRegistrationComponent } from './user-registration.component';
import { MaterialModule } from '../../_matrial';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    UserRegistrationRoutes,
    ComponentsModule
  ],
  declarations: [UserRegistrationComponent],
  exports: [UserRegistrationComponent]
})
export class UserRegistrationModule { }
