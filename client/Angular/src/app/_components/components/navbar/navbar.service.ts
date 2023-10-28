import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class NavbarService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  private baseUrl = environment.apiBase;

  httpOptions = {
    headers: new HttpHeaders({
      accept: 'application/json'
    }),
    withCredentials: true
  };

  // for get account Navigation
  getAccount() {
    var api_url = this.baseUrl + '/account';
    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for create  account Navigation
  createAccount(body: any) {
    var api_url = this.baseUrl + '/account';
    console.log(body);
    return this.http.put<any>(api_url, body, this.httpOptions).pipe(
      map(sidebar => {
        console.log(sidebar);
      }),
      catchError(this.handleError)
    );
  }

  //logout user
  userLogout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionData');
    this.cookieService.delete('Authorization');
    this.router.navigate(['login']);
  }

  linkHubpost(userEmail){
    var url = this.baseUrl + '/autobound/mission_control/integrations/hubspot/userID/' + userEmail;
    return this.http.get<any>(url, this.httpOptions).pipe(
      map(data => {
        console.log(data);
      }),
      catchError(this.handleError)
    );

  }

    // for get settigns
    getAccountSettings() {
      var api_url = this.baseUrl + '/settings';
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  

  //error handle
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  }
}
