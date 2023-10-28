import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './_components/components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './_components/layouts/admin-layout/admin-layout.component';
import { Globals } from './globals';
import { HttpClient} from '@angular/common/http';
import { HttpClientModule,HttpClientXsrfModule } from '@angular/common/http';
import * as $ from 'jquery';
import { DomChangeDirective } from './dom-change.directive';
import { TrashComponentComponent } from './trash-component/trash-component.component';
import { FlextableExamplesComponent } from './flextable-examples/flextable-examples.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  imports: [
    BrowserModule,
    DragDropModule,
    BrowserAnimationsModule,
    FormsModule,
    ComponentsModule,
    RouterModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
        BrowserModule,
    EditorModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    //LinkyModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'Authorization'
    }),
  ],
  
  declarations: [AppComponent, AdminLayoutComponent,DomChangeDirective, TrashComponentComponent, FlextableExamplesComponent],
  providers: [CookieService, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
