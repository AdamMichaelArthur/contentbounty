
import { Component, OnInit, ElementRef } from '@angular/core';
import { BaseComponent } from "../base/base.component";
import { Router, CanActivate } from '@angular/router';
import { Globals } from 'src/app/globals';
import { SharedService } from '../../_services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from '../user-login/authentication.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, take, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import {
  UntypedFormBuilder, UntypedFormGroup,
  Validators,
  FormControl,
  AbstractControl,
  NgForm,
} from '@angular/forms';

@Component({
  selector: 'app-sucess',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class welcomeComponent  {
  welcome_message = "Welcome Back!"
  //subMessage ="Your new password has been sucessfuly saved"
  loginForm: UntypedFormGroup;
  displayUniversityFrame = false;
  displayAuthorityFrame = false;
  content_url = 'https://documentation.contentbounty.com'

  constructor(private router: Router,
    private sharedService: SharedService,
    private cookieService: CookieService,
    public globalVars: Globals,private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    public appComponent: AppComponent,
    public http: HttpClient) {

  }

  userInfo = {}

  showFrame = false;
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
    
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo["dashboard"] == "creator_dashboard"){
      this.displayUniversityFrame = true;
    }

    if(this.userInfo["dashboard"] == "authority_dashboard"){
      this.displayAuthorityFrame = true;
    }
  }

  httpOptions = {

  }

   inject() {

    // var api_url = "/content/";
    

    // return this.http.get(api_url, this.httpOptions).pipe(map(response => {
    //   {
    //   return response
    //   }
    // }), catchError(this.handleError))

  }
  
  public handleError(error: HttpErrorResponse) {
    console.log(282, error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network err  or occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return throwError(`${JSON.stringify(error)}`);
  };

  message = 'Click on a button';
  textBtnConfig = {
    styles: {
      position: 'relative',
      width: '150px',
      height: '60px',
      backgroundColor: '#f92672',
      color: '#fff',
      fontFamily: 'sans-serif',
      fontSize: '20px',
      borderRadius: '10px',
      marginTop: '30px'
    },
    text: 'Click Here'
  };

  imgBtnConfig = {
    styles: {
      position: 'relative',
      width: '100px',
      height: '100px'
    },
    src: '../../../assets/img/conversation.png'
  };



  salmaBtnConfig = {
    text: 'Login'
  }
 

  onClickEventReceived(event: string) {
    this.message = event;
    console.log("KKKKKK")
  }

  onClickEventReceivedImage(event:string){
    this.message = event;
    console.log("Images")

  }

  onClickEventReceivedSalma(event:string){
    this.message = event;
    console.log("Salma")

  }

  /// login start
 

  onFormSubmit(form: NgForm) {
  
      this.globalVars.isLoadingButton = true
      var body = {
        userId: this.loginForm.value.username,
        pwd: this.loginForm.value.password
      };
      this.authenticationService.loginUser(body).subscribe(
        (response: any) => {
          console.log("response");
          console.log(response);
          if (response.Error === 505) {
            this.globalVars.isLoadingButton = false;
          }
          console.log("response");
          if (response.login) {
            console.log(response.Result);
            this.globalVars.isLoadingButton = false;
            this.globalVars.welcome = true;
          }

        }, (error) => {

          console.log("trying again Server error: ");
          console.log(error)
          var connection_error = error
          console.log("connection error :" + connection_error + connection_error.status);
          if (connection_error) {
            console.log("Connection Error");
            
            this.globalVars.isLoadingButton = false;
          }
          console.log('not done error.ErrorDetails');
          console.log(error.error.ErrorDetails)
          var backend_error = error.error.ErrorDetails
          console.log("backendEror:" + backend_error)
          if (backend_error != undefined) {
            if (backend_error.Error === 504) {

              console.log("Invalid username and password")
              this.loginForm.controls['username'].setValue("", {
                emitEvent: false
              });
              this.loginForm.controls['username'].setErrors(null);
              this.loginForm.controls['password'].setErrors(null);
       
              this.globalVars.isLoadingButton = false;
            }

          }
          if (error.status === 500) {
            console.log("Invalid username and password")
            this.loginForm.controls['username'].setValue("", {
              emitEvent: false
            });
            this.loginForm.controls['username'].setErrors(null);
            this.loginForm.controls['password'].setErrors(null);
           
            this.globalVars.isLoadingButton = false;
          }
          if (error.status === 0) {
            this.globalVars.isLoadingButton = false;
            console.log("Connection Error")
           
          }
        }
      );
    
   //}
  }


}