import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { welcomeComponent } from './welcome.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedService } from '../../_services/shared.service';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../../_matrial';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    welcomeComponent,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule
  ],
  declarations: [welcomeComponent],
  providers: [SharedService],
  exports: [welcomeComponent]
})
export class UserLoginModule {}
