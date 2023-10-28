import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from './../authentication.service';
import { AppComponent } from '../../../app.component';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/globals';
import { MustMatch } from '../../user-registration/register.service';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['.././user-password.component.css'],
  providers: [],
})



export class EmailComponent {

  constructor(
    private zone: NgZone,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appComponent: AppComponent, private cookieService: CookieService,
    public globalVars: Globals
  ) { }

  recoveryEmail = ""
  passwordResetForm: UntypedFormGroup;
  public hidep: boolean = false;
  public hidenp: boolean = false;
  public hidecf: boolean = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.recoveryEmail = params['email'];
    });

    //password recover

    this.passwordResetForm = this.formBuilder.group({
      userId: [''],
      recoveryCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirm_password')
    })
  }

  // For Update Login
  hideUserPass = true;
  isShowPass = true;
  showHidePass() {
    this.hideUserPass = !this.hideUserPass;
    this.isShowPass = !this.isShowPass;
    console.log(this.hideUserPass + "&&" + this.isShowPass)
  }
  // For Update Login


  // focusOutFunction
  confirm_password: any = ''
  password: any = '';
  pass_error: boolean = false
  focusOutFunction() {
    console.log(this.password)
    console.log(this.confirm_password)
    if (this.password != this.confirm_password) {
      this.pass_error = true;
    }
    if (this.password === this.confirm_password) {
      this.pass_error = false;
    }
  }

  OnClick() {
    this.pass_error = false;
  }

  OnClickNP() {
    this.pass_error = false;
  }

  get pr() {
    return this.passwordResetForm.controls;
  }

  goBackToRecoveryEmail() {
    this.router.navigate(['/password-recovery']);
    this.forgetPassSubmitted = false
    this.getAccessCodeSubmitted = false
    this.forget = false;
    this.forgetRec = true;
    this.passwordResetForm.reset();
    this.accCodeInvalid = false;
    this.errorMessage = ""
    this.recoveryCodeValid = false;
    this.recoveryCodeInvalid = false;
  }

  accCodeInvalid = false
  sameNewPass = false
  // sendingRecoveryEmail = true
  forgetPassSubmitted = false
  resend = false
  connectionErrorMessage1 = false
  connectionMessageString1 = ''
  errorMessage = "";
  recoveryCodeInvalid = false
  recoveryCodeValid = true
  isLoading = false
  public loginSuccess: boolean = false;
  public loginSuccessLoader: boolean = false;

  element: any;

  disableButton(id) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.setAttribute('disabled', 'true');
  }
  enableButton(id) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.removeAttribute('disabled');
  }

  callLoader() {
    this.globalVars.global_loader = true;
    setTimeout(() => {
      this.loginSuccessLoader = true;
    }, 500)
  }

  // goTopasswordResetForm() {
  //   console.log("trying")
  //   this.forget = true;
  //   // this.sendingRecoveryEmail = false;
  //   this.connectionErrorMessage1 = false;
  //   this.errorMessage = ""
  //   //this.goToEmail();
  // }

  testAccessCode(data) {
    if (data) {
      if (data != "" && data.length <= 4) {
        this.recoveryCodeInvalid = true
        this.recoveryCodeValid = false;
      }
      else if (data != "" && data.length === 5) {
        console.log("trying")
        this.passwordResetForm.controls['recoveryCode'].setErrors(null);
        this.recoveryCodeInvalid = false
        this.recoveryCodeValid = true;
      }
      else if (data != "" && data.length >= 6) {
        console.log("trying")
        this.passwordResetForm.controls['recoveryCode'].setErrors({ 'maxlength': true });
        this.recoveryCodeInvalid = true
        this.recoveryCodeValid = false;
      }
      else {
        // this.passwordResetForm.controls['recoveryCode'].setErrors(null);
        this.recoveryCodeInvalid = true
        this.recoveryCodeValid = false;
      }
    }
  }

  forget: any = true;
  forgetRec: any = true;
  getAccessCodeSubmitted = false
  recover = false;
  recoveryExpiration = '';
  errorPasswordMessage = '';
  errorPasswordError = false;
  resendCode(id) {
    this.isLoading = true;
    this.disableButton(id)

    var body = {
      "userId": this.recoveryEmail,
      "recoveryType": "email"
    }
    this.errorMessage = 'Access code is being resent to the Email Address and Phone Number on file'
    this.resend = false;


    this.authenticationService.accountRecovery(body).subscribe(
      (response: any) => {
        if (response.recover) {
          this.isLoading = false
          this.recoveryExpiration = response.recover.recoveryExpiration
          this.forget = true;
          this.forgetRec = false;
          this.errorMessage = 'Please check email addres for new code';
          this.enableButton(id)
        } else {
          this.errorMessage = response.Result + ': Unable to send recovery text/email, given email address not found!';
          this.forgetRec = true;
        }
      },
      (error) => {
        this.enableButton(id)
        this.isLoading = false
        console.log(error)
        var connection_error = error
        console.log("connection error :" + connection_error + connection_error.status);
        if (connection_error.status === 0) {
          // this.isLoading = false;
          //this.errorMessage = 'Connection error';
          // if(connection_error.status === 0){
          // }
          console.log("Connection Error");
          this.connectionErrorMessage1 = true
          this.connectionMessageString1 = 'Connection error, try again later';
          this.isLoading = false
        }
        // var backend_error = error.error.ErrorDetails
        // console.log(backend_error);
        // console.log("could not get any response")
        // // forcing to go to password reset
        // this.forget = true;
        // this.forgetRec = false;
        // this.resend = false;
        // this.errorMessage = 'Resent to the Email Address and Phone Number on file';
        // forcing to go to password reset
      })
  }


  passwordForget(form: NgForm, id) {
    this.forgetPassSubmitted = true
    this.resend = true
    // this.forget = true;
    // this.forgetRec = false;
    this.connectionErrorMessage1 = false;
    this.errorMessage = ""
    this.sameNewPass = false
    this.accCodeInvalid = false
    if (this.passwordResetForm.invalid) {
      console.log("invalid")
      if (this.passwordResetForm.controls['recoveryCode'].errors) {
        this.recoveryCodeInvalid = true
        this.recoveryCodeValid = false;
      }
      return;
    } else {
      this.disableButton(id)
      this.isLoading = true;
      console.log("recovery Email: " + this.recoveryEmail)
      var body = {
        "userId": this.recoveryEmail,
        "recoveryCode": this.passwordResetForm.value.recoveryCode,
        "newPwd": this.passwordResetForm.value.password
      }
      this.authenticationService.passwordReset(body).subscribe(
        (response: any) => {
          this.enableButton(id)

          if (response.reset) {
            this.errorMessage = '';
            // this.forget = false
            // this.sendingRecoveryEmail = true;
            localStorage.setItem(
              'currentUser',
              JSON.stringify(response.reset.sessionId)
            );
            sessionStorage.setItem('sessionData', response.reset.sessionId);
            this.cookieService.set(
              'Authorization',
              'Basic ' + response.reset.Authorization, 1
            );
            this.appComponent.isUserloggedIn = true;
            setTimeout(() => {
              this.isLoading = false
              this.loginSuccessLoader = true;
            }, 2000)
            setTimeout(() => {
              this.globalVars.global_success = true;
              return this.zone.run(() => this.router.navigate(['app']));
            }, 5000)
            // return this.zone.run(() => this.router.navigate(['app']));
          } else {

            this.errorMessage = response.Result + ': The Recovery Code does not match. Please check your email address for code!';
            this.appComponent.isUserloggedIn = false;
          }
        },
        (error) => {
          this.isLoading = false
          // this.passwordResetForm.controls['recoveryCode'].setValue("", {
          //   emitEvent: false
          // });
          //this.passwordResetForm.controls['recoveryCode'].setErrors(null);
          //this.errorMessage = 'The Access Code Was Invalid';
          console.log(error);
          var connection_error = error
          console.log("connection error :" + connection_error + connection_error.status);

          if (connection_error.status === 0) {
            // this.isLoading = false;
            //this.errorMessage = 'Connection error';
            // if(connection_error.status === 0){
            // }
            this.accCodeInvalid = false
            console.log("Connection Error");
            this.connectionErrorMessage1 = true
            this.connectionMessageString1 = 'Connection error, try again later';
            this.isLoading = false;
          }
          if (connection_error.state === "0") {
            console.log("try")
            // this.isLoading = false;
            //this.errorMessage = 'Connection error';
            // if(connection_error.status === 0){
            // }
            this.sameNewPass = false
            this.accCodeInvalid = false
            console.log("Connection Error");
            this.connectionErrorMessage1 = true
            this.connectionMessageString1 = 'Connection error, try again later';
            this.isLoading = false;
          }
          var backend_error = error.error.ErrorDetails
          console.log(backend_error);
          if (backend_error != undefined) {
            console.log("near")
            console.log(JSON.stringify(backend_error))
            if (backend_error.Error === "600") {
              this.connectionErrorMessage1 = false
              this.sameNewPass = true
              this.accCodeInvalid = false;
              console.log("here")
              this.passwordResetForm.controls['password'].setValue("", {
                emitEvent: false
              });
              this.passwordResetForm.controls['confirm_password'].setValue("", {
                emitEvent: false
              });
              // this.accountRecoveryForm.controls['email'].setErrors(null);
              this.errorMessage = 'The password needs to be different than the last password'
            }
            if (backend_error.Error === "599") {
              this.recoveryCodeInvalid = true
              this.recoveryCodeValid = false;
              console.log("now")
              this.connectionErrorMessage1 = false
              this.sameNewPass = false
              this.accCodeInvalid = true;
              this.passwordResetForm.controls['recoveryCode'].setValue("", {
                emitEvent: false
              });
              // this.accountRecoveryForm.controls['email'].setErrors(null);
              this.errorMessage = 'The Recovery Code does not match'
            }

            this.isLoading = false;
          }
          //{Error: "599", Description: "The Recovery Code does not match"}
          // this.errorMessage = 'Invalid Email Address';
          this.enableButton(id)
          this.appComponent.isUserloggedIn = false;
          // this.errorMessage = 'The Access Code Was Invalid';
          // this.appComponent.isUserloggedIn = false;
        }
      )
    }
  }

  // Preview Password
  passLength1: boolean = false;
  passLength2: boolean = false;
  passLength3: boolean = false;
  passLength4: boolean = false;
  passLength5: boolean = false;
  passLength6: boolean = false;
  passLength7: boolean = false;
  passLength8: boolean = false;
  previewPassword() {
    // console.log(this.registerForm.value.password.length)
    // console.log(this.password.length)
    if (this.password.length === 1) {
      this.passLength1 = true;
    } else {
      this.passLength1 = false;
    };
    if (this.password.length === 2) {
      this.passLength1 = true;
      this.passLength2 = true;
    } else {
      this.passLength2 = false;
    };
    if (this.password.length === 3) {
      this.passLength1 = true;
      this.passLength2 = true;
      this.passLength3 = true;
    } else {
      this.passLength3 = false;
    };
    if (this.password.length === 4) {
      this.passLength1 = true;
      this.passLength2 = true;
      this.passLength3 = true;
      this.passLength4 = true;
    } else {
      this.passLength4 = false;
    };
    if (this.password.length === 5) {
      this.passLength1 = true;
      this.passLength2 = true;
      this.passLength3 = true;
      this.passLength4 = true;
      this.passLength5 = true;
    } else {
      this.passLength5 = false;
    };
    if (this.password.length === 6) {
      this.passLength1 = true;
      this.passLength2 = true;
      this.passLength3 = true;
      this.passLength4 = true;
      this.passLength5 = true;
      this.passLength6 = true;
    } else {
      this.passLength6 = false;
    };
    if (this.password.length === 7) {
      this.passLength1 = true;
      this.passLength2 = true;
      this.passLength3 = true;
      this.passLength4 = true;
      this.passLength5 = true;
      this.passLength6 = true;
      this.passLength7 = true;
    } else {
      this.passLength7 = false;
    };
    if (this.password.length >= 8) {
      this.passLength1 = true;
      this.passLength2 = true;
      this.passLength3 = true;
      this.passLength4 = true;
      this.passLength5 = true;
      this.passLength6 = true;
      this.passLength7 = true;
      this.passLength8 = true;
    } else {
      this.passLength8 = false;
    }
  }
  // Preview Password
}
