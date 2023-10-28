import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, take, catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { UntypedFormGroup, AbstractControl } from '@angular/forms';

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient) { }

  private baseUrl = environment.apiBase;
  private url = this.baseUrl + '/register'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
  };

  register(user: any) {
    // console.log(user);
    return this.http.post(this.url, user).pipe(
      map(user => {
        //console.log('registration complete');
        return user
      }),
      catchError(this.handleError),
      retry(3)
    );
  }

  update(user: any) {
    return this.http
      .put(this.url + user.id, user)
      .pipe(catchError(this.handleError));
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {

  }

  // Send phone verfificaiton when new user sign up
  SendVerificationPhone() {

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      return throwError(error);
    }
    //return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };

  //private handleError(error: HttpErrorResponse) {
    // return throwError(error.message || "Server Error");
    // console.log(error)
    // return throwError(error);
    // if (error.error instanceof ErrorEvent) {
    //   console.log(JSON.stringify(error))
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.error('An error occurred:', error.error.message);
    // } else {
    //   console.log(JSON.stringify(error))
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong,
    //   console.error(
    //     `Backend returned code ${error.status}, ` + `body was: ${error.error.ErrorDetails.Description}`
    //   );
    // }

    // var dupEmail = /email_1/gi;
    // var dupPhone = /phone/gi;
    // var str = error.error.ErrorDetails.Description;
    // if (str.search(dupEmail) != -1) {
    //   return throwError(11000);
    // }
    // else if (str.search(dupPhone) != -1) {
    //   return throwError(12000);
    // }
    // else {
    //   return throwError(13000);
    // }
    // return throwError(error.error.Error);
  //}
}
