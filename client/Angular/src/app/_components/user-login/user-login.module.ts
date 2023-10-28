import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoginRoutes } from './user-login.routing';
import { UserLoginComponent } from './user-login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedService } from '../../_services/shared.service';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../../_matrial';
import { ButtomLoginComponent } from '../buttom_login/buttom.component'


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    UserLoginRoutes,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule
  ],
  declarations: [UserLoginComponent, ButtomLoginComponent],
  providers: [SharedService],
  exports: [UserLoginComponent]
})
export class UserLoginModule { }
