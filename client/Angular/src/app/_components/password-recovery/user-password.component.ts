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
import { AuthenticationService } from './authentication.service';
import { AppComponent } from '../../app.component';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/globals';
import { MustMatch } from '../user-registration/register.service';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';


@Component({
  selector: 'app-password-recover',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css'],
  providers: [],
})

export class UserPasswordComponent implements OnInit {

  public hidep: boolean = false;
  public hidenp: boolean = false;
  public hidecf: boolean = false;
  accountRecoveryForm: UntypedFormGroup;
  // loginForm: FormGroup;

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

    // this.loginForm = this.formBuilder.group({
    //   username: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(4)]]
    // });

    this.accountRecoveryForm = this.formBuilder.group({
      userId: [''],
      email: ['', [Validators.required, Validators.email]],
      recoveryType: ['email']
    });

    //password recover

    // this.passwordResetForm = this.formBuilder.group({
    //   userId: [''],
    //   recoveryCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    //   password: ['', [Validators.required, Validators.minLength(8)]],
    //   confirm_password: ['', Validators.required],
    // }, {
    //   validator: MustMatch('password', 'confirm_password')
    // })
  }

  // convenience getter for easy access to form fields
  // get f() {
  //   return this.loginForm.controls;
  // }

  get r() {
    return this.accountRecoveryForm.controls;
  }

  // get pr() {
  //   return this.passwordResetForm.controls;
  // }

  isLoading: boolean = false;
  ifNoResponsed: boolean = false;



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
  forgetRec: any = true;
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
      this.disableButton(id)
      this.recoveryFormInvalid = false;
      this.isLoading = true;
      // this.resend = false
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
            this.enableButton(id)

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
          // this.sendingRecoveryEmail = false;
          this.forgetRec = true;
        })

    }
  }



  goBackToLogin() {

    this.zone.run(() => this.router.navigate(['login']));

  }



  message: string;


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
  callLoader() {
    this.globalVars.global_loader = true;
    setTimeout(() => {
      this.loginSuccessLoader = true;
    }, 500)
  }

  goToEmail() {
    this.router.navigate(['/recovery'], { queryParams: { email: 'gugly2009@gmail.com' } });
  }

}
