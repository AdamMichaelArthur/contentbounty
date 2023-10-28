import { Injectable, NgZone } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, take, catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  isUserLoggedIn: any = false;

  private loggedInStatus = false;
  cookieValue = 'UNKNOWN';
  constructor(
    private zone: NgZone,
    private http: HttpClient,
    private _router: Router,
    private cookieService: CookieService
  ) { }

  setLoggedIn(value: boolean) {
    this.loggedInStatus = value;
  }

  get LoggedIn() {
    return this.loggedInStatus;
  }

  private baseUrl = environment.apiBase;
  private api_url = this.baseUrl + '/login'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
  };

  loginUser(user: any) {
    //console.log(user);
    return this.http.post<any>(this.api_url, user, this.httpOptions).pipe(
      map(user => {
        //console.log(user);
        // login successful if there's a jwt token in the response
        if (user.login) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(
            'currentUser',
            JSON.stringify(user.login.sessionId)
          );

          localStorage.setItem(
            'userInfo',
            JSON.stringify(user)
          );

          sessionStorage.setItem('sessionData', user.login.sessionId);
          // this.cookieService.set(
          //   'Authorization',
          //   'Basic ' + user.login.Authorization
          // );
          this.cookieService.set('Authorization', 'Basic ' + user.login.Authorization, 1);
          this.cookieValue = this.cookieService.get('Authorization');
          // console.log(65, this.cookieValue);
          this.isUserLoggedIn = true;
          this.loggedIn();
        } else {
        }
        return user;
      }),
      catchError(this.handleError),
      retry(3)
    );
  }

  sessionStoreData() {
    sessionStorage.getItem('sessionData');
  }
  localStorageData() {
    sessionStorage.getItem('localstoge');
  }

  logutUser() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionData');
    this.isUserLoggedIn = false;
    this.cookieService.delete('Authorization');
    this.zone.run(() => this._router.navigate(['login']));
    return this.http.post<any>(this.api_url, this.httpOptions).pipe(
      map(user => {
        //console.log(user.ErrorDetails);
      }),
      catchError(this.handleError)
    );
  }

  sessionOut() {
    sessionStorage.removeItem('sessionData');
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  // isUSerLoggedIn(){
  //     return true
  // }

  loggedIn() {
    //console.log(this.isUserLoggedIn);
    return this.isUserLoggedIn;
  }

  public getToken(): string {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser;
  }


  httpOptions1 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    })
  };

  accountRecovery(value: any) {
    console.log("value from service")
    console.log(value);
    var api_url = this.baseUrl + '/recover';
    //var body={ userId: value.userId, recoveryType: value.recovertype }
    return this.http.post<any>(api_url, value)
      .pipe(
        map(user => {
          console.log(user);
          return user;
        }), catchError(this.handleError)
      )
  }

  //Password reset 
  passwordReset(value: any) {
    var api_url = this.baseUrl + '/reset';
    return this.http.post<any>(api_url, value)
      .pipe(
        map(user => {
          //console.log(user);
          return user;
        }), catchError(this.handleError)
      )
  }

  //verfication by phone or email
  verifyUser(verificationType: any) {
    //console.log(verificationType);
    var Body = {
      verificationType: verificationType
    };
    var api_url = this.baseUrl + '/verify';
    return this.http.post<any>(this.api_url, Body, this.httpOptions).pipe(
      map(user => {
        //console.log(user);
      }
      )),
      catchError(this.handleError)
  }



  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      return throwError(error);
    }
    //return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };

  // private handleError(error: HttpErrorResponse) {
  //   // return throwError(error.message || "Server Error");
  //   console.log(error)
  //   return throwError(error);
  // }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     //console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     //console.error(
  //     //`Backend returned code ${error.status}, ` + `body was: ${error.error}`
  //     //);
  //   }
  //   // return an observable with a user-facing error message
  //   // return throwError('Something bad happened; please try again later.');
  //   return throwError(error.error.Error);
  //   // email error test
  //   // return throwError();
  //   // phone error test
  //   // return throwError(12000);
  // }
}

