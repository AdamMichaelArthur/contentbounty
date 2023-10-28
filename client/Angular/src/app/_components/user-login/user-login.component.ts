import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { AppComponent } from '../../app.component';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/globals';
import { MustMatch } from '../user-registration/register.service';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';


@Component({
  selector: 'app-login-user',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  providers: [],
})

export class UserLoginComponent implements OnInit {

  public hidep: boolean = false;
  public hidenp: boolean = false;
  public hidecf: boolean = false;
  accountRecoveryForm: UntypedFormGroup;
  loginForm: UntypedFormGroup;
  passwordResetForm: UntypedFormGroup;
  signingIn = true;
  submitted = false;
  isUserLoggedIn: any = false;
  currentUser: any = '';
  returnUrl: string;
  errorMessage = '';
  username = '';
  authError;

  constructor(
    private zone: NgZone,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private appComponent: AppComponent, private cookieService: CookieService,
    public globalVars: Globals
  ) { }
  private pre: any = '+1';
  ngOnInit() {

    const cookieExists: boolean = this.cookieService.check('Authorization');
    // console.log("cookieExists login: "+cookieExists);

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.accountRecoveryForm = this.formBuilder.group({
      userId: [''],
      email: ['', [Validators.required, Validators.email]],
      recoveryType: ['email']
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

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get r() {
    return this.accountRecoveryForm.controls;
  }

  get pr() {
    return this.passwordResetForm.controls;
  }

  isLoading: boolean = false;
  ifNoResponsed: boolean = false;
  // onFormSubmit(form: NgForm) {
  //   this.submitted = true;

  //   if (this.loginForm.invalid) {
  //     console.log('from invalid');
  //     return;
  //   } else {
  //     this.isLoading = true
  //     var body = {
  //       userId: this.loginForm.value.username,
  //       pwd: this.loginForm.value.password
  //     };
  //     this.authenticationService.loginUser(body).subscribe(
  //       (response: any) => {
  //         console.log(response);
  //         if (response.login) {
  //           setTimeout(()=>{
  //             this.ifNoResponsed = true;
  //           },5000)
  //           console.log(response.Result);
  //           this.isLoading = false;
  //           this.errorMessage = '';
  //           this.username = this.loginForm.value.username;
  //           sessionStorage.setItem('email', this.username);
  //           this.appComponent.isUserloggedIn = true;
  //           this.globalVars.loggedInUsername = this.username
  //           return this.zone.run(() => this.router.navigate(['app']));
  //         }
  //         else {
  //           this.loginForm.controls['password'].setValue("", {
  //             emitEvent: false
  //           });
  //           this.loginForm.controls['password'].setErrors(null);
  //           this.errorMessage = 'Wrong Password';
  //           this.appComponent.isUserloggedIn = false;
  //         }
  //       },
  //       error => {
  //         this.authError = true;
  //         if (error === 504) {
  //           this.loginForm.controls['username'].setValue("", {
  //             emitEvent: false
  //           });
  //           this.loginForm.controls['username'].setErrors(null);
  //           this.errorMessage = 'Invalid Email Address';
  //         }

  //         this.appComponent.isUserloggedIn = false;
  //         console.log("Login error!")
  //       }
  //     );
  //   }
  // }


  loginErrorMessage: boolean = false
  loginErrorMessageString: string = '';
  connectionErrorMessage1: boolean = false
  connectionMessageString1: string = '';
  public loginSuccess: boolean = false;
  public loginSuccessLoader: boolean = false;

  // start loader after login 
  global: boolean = true
  startLoader() {
    this.globalVars.global_loader = true;
    this.global = this.globalVars.global_loader

    console.log("try Loader from Login: " + this.globalVars.global_loader)
  }


  buttom_Config_text = {
    text: 'Login'
  }


  onFormSubmit(form: NgForm, id) {
    var error504 = false
    this.submitted = false;
    this.loginErrorMessage = false
    this.globalVars.isLoadingButton = true
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.submitted = true
      console.log('from invalid');
      this.globalVars.isLoadingButton = false
      return;
    } else {
      this.disableButton(id)
      this.submitted = true
      this.isLoading = true
      var body = {
        userId: this.loginForm.value.username,
        pwd: this.loginForm.value.password
      };
      this.authenticationService.loginUser(body).subscribe(
        (response: any) => {
          this.enableButton(id)
          console.log("response");
          console.log(response);
          if (response.Error === 505) {
            this.loginForm.controls['password'].setValue("", {
              emitEvent: false
            });
            // this.loginForm.controls['password'].setErrors(null);
            this.loginErrorMessage = true
            this.loginErrorMessageString = 'Invalid Password';
            this.isLoading = false;
            this.globalVars.isLoadingButton = false
          }
          console.log("response");
          if (response.login) {
            console.log(response.Result);
            this.isLoading = false;
            this.globalVars.isLoadingButton = false
            this.loginSuccess = true;
            this.startLoader();
            this.errorMessage = '';
            this.username = this.loginForm.value.username;
            sessionStorage.setItem('email', this.username);
            this.appComponent.isUserloggedIn = true;
            this.globalVars.loggedInUsername = this.username
            this.globalVars.welcome = true;

            setTimeout(() => {
              this.loginSuccessLoader = true;
            }, 1000)
            setTimeout(() => {

              return this.zone.run(() => this.router.navigate(['app']));
            }, 3000)
          }

        }, (error) => {
          this.enableButton(id)
          console.log("trying again Server error: ");
          console.log(error)
          var connection_error = error
          console.log("connection error :" + connection_error + connection_error.status);
          if (connection_error) {
            // this.isLoading = false;
            //this.errorMessage = 'Connection error';
            // if(connection_error.status === 0){
            // }
            console.log("Connection Error");
            this.connectionErrorMessage1 = true
            this.connectionMessageString1 = 'Connection error, try again later';
            this.isLoading = false;
            this.globalVars.isLoadingButton = false
          }
          console.log('not done error.ErrorDetails');
          console.log(error.error.ErrorDetails)
          var backend_error = error.error.ErrorDetails
          console.log("backendEror:" + backend_error)
          if (backend_error != undefined) {
            this.connectionErrorMessage1 = false
            if (backend_error.Error === 504) {

              console.log("Invalid username and password")
              this.loginForm.controls['username'].setValue("", {
                emitEvent: false
              });
              // this.loginForm.controls['username'].setErrors(null);
              this.loginForm.controls['password'].setErrors(null);
              this.loginErrorMessage = true
              this.loginErrorMessageString = 'Invalid Email Address/Username';
              this.isLoading = false;
              this.globalVars.isLoadingButton = false
            }

            if (backend_error.Error === 502) {

              console.log("Server error 502 testing from salma")
              this.loginForm.controls['username'].setValue("", {
                emitEvent: false
              });
              // this.loginForm.controls['username'].setErrors(null);
              this.loginForm.controls['password'].setErrors(null);
              this.loginErrorMessage = true
              this.loginErrorMessageString = 'Server error .. ';
              this.isLoading = false;
              this.globalVars.isLoadingButton = false
            }



          }

          // console.log(error)
          // console.log(error.message)
          // console.log(error.statusText)
          // console.log(error.status)
          if (error.status === 500) {
            console.log("Invalid username and password")
            this.loginForm.controls['username'].setValue("", {
              emitEvent: false
            });
            // this.loginForm.controls['username'].setErrors(null);
            this.loginForm.controls['password'].setErrors(null);
            this.loginErrorMessage = true
            this.loginErrorMessageString = 'Invalid Email Address/Password';
            this.isLoading = false;
            this.globalVars.isLoadingButton = false
          }
          if (error.status === 0) {
            this.isLoading = false;
            //this.errorMessage = 'Connection error';
            console.log("Connection Error")
            this.loginErrorMessage = true
            this.loginErrorMessageString = 'Connection error, try again later';
            this.globalVars.isLoadingButton = false
          }
          if (error.status === 502) {
            this.isLoading = false;
            //this.errorMessage = 'Connection error';
            console.log("Connection Error")
            this.loginErrorMessage = true
            this.loginErrorMessageString = 'Connection error, try again later';
            this.globalVars.isLoadingButton = false
          }
        }
      );
    }
  }

  element: any;

  disableButton(id) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.setAttribute('disabled', 'true');
  }
  enableButton(id) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.removeAttribute('disabled');
  }


  //Account recover
  forget: any = false;
  forgetRec: any = false;
  getAccessCodeSubmitted = false
  forgetPassSubmitted = false
  recover = false;
  recoveryExpiration = '';
  // recoveryType = this.accountRecoveryForm.value.recovertype;

  recoveryEmail = ''
  recoveryFormInvalid = false
  recoveryFormValid = false

  accountRecovery(form: NgForm, id) {
    this.errorMessage = ''
    this.connectionErrorMessage1 = false;
    this.getAccessCodeSubmitted = true;
    this.recoveryEmail = this.accountRecoveryForm.value.email
    this.forgetPassSubmitted = false
    this.errorMessage = ""
    if (this.accountRecoveryForm.invalid) {
      this.recoveryFormInvalid = true;
      console.log(this.accountRecoveryForm)
      console.log('from invalid');
      return;
    } else {
      // this.disableButton(id)
      this.recoveryFormInvalid = false;
      this.isLoading = true;
      this.resend = false
      this.signingIn = false
      this.accountRecoveryForm.value.userId = ''
      var body = {
        "userId": this.accountRecoveryForm.value.email,
        "recoveryType": "email"
      }

      this.authenticationService.accountRecovery(body).subscribe(
        (response: any) => {
          this.isLoading = false
          console.log("see some response")
          if (response.recover) {
            this.recoveryExpiration = response.recover.recoveryExpiration
            this.router.navigate(['/recovery'], { queryParams: { email: this.accountRecoveryForm.value.email } });
            // this.sendingRecoveryEmail = true;
            // this.forgetRec = false;
            // this.errorMessage = ""
            // console.log("new error message found")
            // this.enableButton(id)
          } else {
            console.log("nwe here error message found")
            console.log("response error message found")
            this.errorMessage = response.Result + ': Unable to send recovery text/email, given email address not found!';
            this.forgetRec = true;
          }
        },
        (error) => {
          var connection_error = error
          // console.log("connection error :" + connection_error + connection_error.status);
          if (connection_error.status === 0) {
            // this.isLoading = false;
            //this.errorMessage = 'Connection error';
            // if(connection_error.status === 0){
            // }
            console.log("Connection Error");
            this.connectionErrorMessage1 = true
            this.connectionMessageString1 = 'Connection error, try again later';
            this.isLoading = false;
          }
          var backend_error = error.error.ErrorDetails
          console.log(backend_error);
          if (backend_error != undefined) {
            if (backend_error.Error === 701) {
              this.accountRecoveryForm.controls['email'].setValue("", {
                emitEvent: false
              });
              this.recoveryFormInvalid = true;
              // this.accountRecoveryForm.controls['email'].setErrors(null);
              this.errorMessage = 'Unable to send recover text/email. Email addres not found!';
            }
            // if (backend_error.Error === 600) {
            //   this.errorMessage = 'The password needs to be different than the last password'
            // }

            this.isLoading = false;
          }
          this.enableButton(id)
          this.sendingRecoveryEmail = false;
          this.forgetRec = true;
        })

    }
  }

  resend = false
  errorPasswordMessage = '';
  errorPasswordError = false;
  resendCode(id) {
    this.isLoading = true;
    // this.disableButton(id)

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


  getAccessCode() {

    this.signingIn = false
    this.forgetRec = true
    this.errorMessage = ''
    this.router.navigate(['password-recovery']);
  }

  goTopasswordResetForm() {
    console.log("trying")
    this.forget = true;
    this.sendingRecoveryEmail = false;
    this.connectionErrorMessage1 = false;
    this.errorMessage = ""
  }

  goBackToLogin() {
    this.signingIn = true
    this.forgetRec = false
    this.getAccessCodeSubmitted = false
    this.forget = false;
    this.forgetRec = false;
    this.errorMessage = '';
    this.recoveryExpiration = '';
    this.submitted = false

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.accountRecoveryForm = this.formBuilder.group({
      userId: [''],
      email: ['', [Validators.required, Validators.email]],
      recoveryType: ['email']
    });

    this.passwordResetForm = this.formBuilder.group({
      userId: [''],
      recoveryCode: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirm_password')
    })


  }

  goBackToRecoveryEmail() {
    this.forgetPassSubmitted = false
    this.getAccessCodeSubmitted = false
    this.submitted = false
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
  sendingRecoveryEmail = false

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
      // this.disableButton(id)
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


  // loginWithPhone() {
  //   this.forget = false;
  //   this.forgetRec = false;
  //   this.errorMessage = '';

  //   this.loginFormPhone = this.formBuilder.group({
  //     phone: ['', Validators.required],
  //     password: ['', [Validators.required, Validators.minLength(4)]]
  //   });

  // }

  // loginWithEmail() {
  //   this.forget = false;
  //   this.forgetRec = false;
  //   this.loginEmail = true;
  //   this.errorMessage = '';
  //   this.loginPhone = false;

  //   this.loginFormEmail = this.formBuilder.group({
  //     email: ['', Validators.required],
  //     password: ['', [Validators.required, Validators.minLength(4)]]
  //   });

  // }

  message: string;
  valPhone() {
    const phoneControl: AbstractControl = this.loginForm.controls['phone'];
    phoneControl.valueChanges.subscribe(data => {
      let preInputValue: string = this.loginForm.value.phone;
      var lastChar: string = preInputValue.substr(preInputValue.length - 1);
      // remove all mask characters (keep only numeric)
      var newVal = data.replace(/\D/g, '');
      //when removed value from input
      if (data.length < preInputValue.length) {
        this.message = 'Removing Phone...'; //Just console
        /**while removing if we encounter ) character,
         then remove the last digit too.*/
        if (lastChar == ')') {
          newVal = newVal.substr(0, newVal.length - 1);
        }
        if (newVal.length == 0) {
          newVal = '';
        } else if (newVal.length <= 3) {
          /**when removing, we change pattern match.
           "otherwise deleting of non-numeric characters is not recognized"*/
          newVal = newVal.replace(/^(\d{0,3})/, '($1');
        } else if (newVal.length <= 6) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }
        //when typed value in input
      } else {
        this.message = 'Typing phone...'; //Just console
        // don't show braces for empty value
        if (newVal.length == 0) {
          newVal = '';
        } else if (newVal.length <= 3) {
          // don't show braces for empty groups at the end
          newVal = newVal.replace(/^(\d{0,3})/, '($1)');
        } else if (newVal.length <= 6) {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
        } else {
          newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
        }
      }
      this.loginForm.controls['phone'].setValue(newVal, {
        emitEvent: false
      });
    });
  }

  // validate number

  _keyUp(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  // checkMacSafari(event: any) {
  //   var ua = navigator.userAgent.toLowerCase();
  //   if (ua.indexOf('safari') != -1) {
  //     if (ua.indexOf('chrome') > -1) {
  //       // alert("1") // Chrome
  //     } else {
  //       // alert("2") // Safari
  //       if (event.keyCode === 8) {
  //         event.target.value = event.target.value.slice(0, -1);
  //       }
  //     }
  //   }
  // }

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

  // password recovery email validation by noor
  testEmail(data) {
    // console.log("daa: " + data)
    // console.log("email: " + this.accountRecoveryForm.value.email)
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (data != "" && data.length <= 5) {
      this.recoveryFormInvalid = true
      this.recoveryFormValid = false;
    }
    else if (data != "" && (data.length <= 5 || !regularExpression.test(data))) {
      this.accountRecoveryForm.controls['email'].setErrors(null);
      this.recoveryFormInvalid = true
      this.recoveryFormValid = false;
    }
    else {
      this.accountRecoveryForm.controls['email'].setErrors({ 'email': true });
      this.recoveryFormInvalid = false
      this.recoveryFormValid = true;
    }
  }

  recoveryCodeInvalid = false;
  recoveryCodeValid = false;
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
  callLoader() {
    this.globalVars.global_loader = true;
    setTimeout(() => {
      this.loginSuccessLoader = true;
    }, 500)
  }
}
