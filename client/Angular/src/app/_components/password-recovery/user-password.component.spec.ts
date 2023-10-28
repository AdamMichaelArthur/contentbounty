import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { UserPasswordComponent } from './user-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormBuilder, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from 'src/app/app.component';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/globals';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const loginServiceSpy = jasmine.createSpyObj('AuthenticationService', ['login']);

const testUserData = { id: 1, name: 'TekLoon' };
const loginErrorMsg = 'Invalid Login';
const form = NgForm

export const validUser = {
  username: '00132126',
  password: '123456'
};

export const blankUser = {
  username: '',
  password: ''
};


// describe('Login Component Isolated Test', () => {
//   let component: UserLoginComponent;

//   beforeEach(async(() => {
//     component = new UserLoginComponent(routerSpy, new FormBuilder(), loginServiceSpy, NgZone,
//       ActivatedRoute,
//       AppComponent,
//       CookieService,
//       Globals);
//   }));

//   function updateForm(userEmail, userPassword) {
//     component.loginForm.controls['username'].setValue(userEmail);
//     component.loginForm.controls['password'].setValue(userPassword);
//   }

//   it('Component successfully created', () => {
//     expect(component).toBeTruthy();
//   });

//   it('component initial state', () => {
//     expect(component.submitted).toBeFalsy();
//     expect(component.loginForm).toBeDefined();
//     expect(component.loginForm.invalid).toBeTruthy();
//     expect(component.authError).toBeFalsy();
//     expect(component.errorMessage).toBeUndefined();
//   });

//   // it('submitted should be true when onSubmit()', () => {
//   //   component.onFormSubmit(new NgForm());
//   //   expect(component.submitted).toBeTruthy();
//   //   expect(component.authError).toBeFalsy();
//   // });

//   it('form value should update from when u change the input', (() => {
//     updateForm(validUser.username, validUser.password);
//     expect(component.loginForm.value).toEqual(validUser);
//   }));

//   it('Form invalid should be true when form is invalid', (() => {
//     updateForm(blankUser.username, blankUser.password);
//     expect(component.loginForm.invalid).toBeTruthy();
//   }));
// });



describe('UserPasswordComponent', () => {
  let component: UserPasswordComponent;
  let fixture: ComponentFixture<UserPasswordComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UserPasswordComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
