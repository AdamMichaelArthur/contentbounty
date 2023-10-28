
import { Component, OnInit, ElementRef } from '@angular/core';
import { BaseComponent } from "../base/base.component";
import { Router, CanActivate } from '@angular/router';
import { Globals } from 'src/app/globals';
import { SharedService } from '../../_services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';


import {
  FormBuilder, FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  NgForm,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const loadStripe: any;

@Component({
  selector: 'app-sucess',
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.css']
})

export class sucessComponent  {
  message = "Success!"
  subMessage ="Your new password has been sucessfuly saved"

  constructor(private router: Router,
    private sharedService: SharedService,
    private cookieService: CookieService,
    public globalVars: Globals,
    public appComponent: AppComponent) {

  }

  ngOnInit() {

  }

  userLogout() {
    
    this.globalVars.loggedInUserEmail = ''
    this.globalVars.loggedInUsername = ''
    this.appComponent.isUserloggedIn = false;
    this.globalVars.global_success = false;
    this.globalVars.global_loader = false;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionData');
    this.cookieService.delete('Authorization');
    this.router.navigate(['login']);
  }


  
  
}