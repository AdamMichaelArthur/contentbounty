import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { RegisterService, MustMatch } from './register.service';
import { AppComponent } from '../../app.component';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-registration-user',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  // registerForm1: FormGroup;
  public hidep: boolean = false;
  public hidecf: boolean = false;
  loading = false;
  submitted = false;
  registerForm: UntypedFormGroup;
  cookieValue = 'UNKNOWN';
  emailDupOrInvalid = false
  phoneDuplicate = false
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private appComponent: AppComponent,
    private cookieService: CookieService,
    public globalVars: Globals
  ) { }

  ngOnInit() {
    const cookieExists: boolean = this.cookieService.check('Authorization');
    console.log("cookieExists registration: " + cookieExists);
    // reactive from with angular from
    this.registerForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.email])
      ],
      first_name: [
        '',
        Validators.compose([Validators.required, Validators.minLength(2)])
      ],
      last_name: [
        '',
        Validators.minLength(2)
      ],
      phone: ['', Validators.compose([Validators.minLength(14)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      confirm_password: ['', Validators.required],
      account_type: ['authority', Validators.required]
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
    // this.startLoader()
    // this.registrationSuccess = true;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // useign angular matarial gettign anf sunmiting reactive from value

  element: any;

  disableButton(id) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.setAttribute('disabled', 'true');
    console.log(this.element);
  }
  enableButton(id) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.removeAttribute('disabled');
  }

  errorMessage = '';
  registerErrorMessage: boolean = false;
  registerErrorMessageString: string = '';
  registerErrorMessage1: boolean = false
  registerErrorMessageString1: string = '';

  public registrationSuccess: boolean = false;
  public registrationSuccessLoader: boolean = false;
  onFormSubmit(form: NgForm, id) {
    console.log(id);
    this.submitted = false;
    this.pass_error = false;
    this.registerErrorMessage1 = false;
    this.errorMessage = '';
    // var number = this.registerForm.value.phone.toString();
    // var phone_num =
    //   number.substring(1, 4) +
    //   number.substring(6, 9) +
    //   number.substring(10, 14);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      this.submitted = true;
      console.log('from invalid');
      console.log(this.registerForm.value);
      return;
    } else {
      this.disableButton(id)
      this.submitted = true;
      this.loading = true;
      var user = {
        email: this.registerForm.value.email,
        pwd: this.registerForm.value.password,
        phone: this.registerForm.value.phone,
        first_name: this.registerForm.value.first_name,
        last_name: this.registerForm.value.last_name,
        account_type: this.registerForm.value.account_type,
      };
      if(this.registerForm.value.account_type == "creator")
        user["skill"] = ["writing","editing","photoshop","wordpress"]
      else
        user["skill"] = ["admin"]
      // error role is not a support key so role is removed temporarily
      // ,
      //   role: this.registerForm.value.role
      // error role is not a support key so role is removed temporarily

      console.log(user);
      this.registerService.register(user)
        .pipe(first())
        .subscribe(
          (data: any) => {
            console.log("response");
            console.log(data);
            console.log("response");
            //this.router.navigate(['/login']);
            this.enableButton(id)
            if (data.account) {

              this.loading = false;
              this.errorMessage = '';
              console.log('done');
              localStorage.setItem(
                'currentUser',
                JSON.stringify(data.account.sessionId)
              );
              sessionStorage.setItem('sessionData', data.account.sessionId);
              this.cookieService.set(
                'Authorization',
                'Basic ' + data.account.Authorization, 1,
              );
              this.cookieValue = this.cookieService.get('Authorization');
              console.log(this.cookieValue);
              this.appComponent.isUserloggedIn = true;
              this.registrationSuccess = true;
              setTimeout(() => {
                this.registrationSuccessLoader = true;
              }, 2000)
              this.startLoader();
              this.SendVerificationMail();
              setTimeout(() => {
                return this.zone.run(() => this.router.navigate(['app']));
              }, 4000)
              // return this.zone.run(() => this.router.navigate(['app']));
            } else {
              this.errorMessage = data.ErrorDetails;
              this.appComponent.isUserloggedIn = false;
            }
          },
          error => {
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
              console.log("Connection Error")
              this.registerErrorMessage1 = true
              this.registerErrorMessageString1 = 'Connection error, please try again later!';
              this.loading = false;
            }
            console.log('not done error.ErrorDetails');
            console.log(error.error.ErrorDetails)

            var backend_error = error.error.ErrorDetails

            console.log("backendEror:" + backend_error)
            if (backend_error != undefined) {
              this.registerErrorMessage1 = false
              if (backend_error.Error === 11000) {
                this.emailDupOrInvalid = true
                this.phoneDuplicate = false
                this.registerForm.controls['email'].setValue("", {
                  emitEvent: true
                });
                // this.registerForm.controls['email'].setErrors(null);
                this.errorMessage = 'The EMAIL address is already in use.';
              }
              if (backend_error.Error === 12000) {
                this.phoneDuplicate = true
                this.emailDupOrInvalid = false
                this.registerForm.controls['phone'].setValue("", {
                  emitEvent: false
                });
                this.registerForm.controls['phone'].setErrors(null);
                this.errorMessage = 'The CELL PHONE NUMBER is already in use.';
              }
              if (backend_error.Error === 13000) {
                this.emailDupOrInvalid = true
                this.phoneDuplicate = false
                this.registerForm.controls['email'].setValue("", {
                  emitEvent: false
                });
                this.registerForm.controls['email'].setErrors(null);
                this.errorMessage = 'The provided email address is invalid';
              }
              this.loading = false;
              // // this.errorMessage = 'Email already exits!';
              // if (error.Error === 504) {
              //   this.errorMessage = 'The server is down, please try again later!';
              // }
            }



            this.appComponent.isUserloggedIn = false;

          }
        );
    }
  }


  // start loader after login 
  global: boolean = true
  startLoader() {
    this.globalVars.global_loader = true;
    this.global = this.globalVars.global_loader

    console.log("try Loader from Login: " + this.globalVars.global_loader)
  }

  hasNumber(myString) {
    return /\d/.test(myString);
  }



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

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {

  }

  // Send phone verfificaiton when new user sign up
  SendVerificationPhone() {

  }


  //passcode
  hide = true;
  forget = false;

  message: string;
  valPhone() {
    const phoneControl: AbstractControl = this.registerForm.controls['phone'];
    phoneControl.valueChanges.subscribe(data => {
      let preInputValue: string = this.registerForm.value.phone;
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
      this.registerForm.controls['phone'].setValue(newVal, {
        emitEvent: false
      });
    });
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
