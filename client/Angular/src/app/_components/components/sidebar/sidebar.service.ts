import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map,take,catchError} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor(private http: HttpClient, private cookieService:CookieService, private router: Router) { 
}

  private baseUrl=environment.apiBase
  private api_url = this.baseUrl+'/sidebar';

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json'
    }),
    withCredentials: true
  };

  getSidebar() {
    var api_url = this.api_url; 
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        // console.log(response)
        return response
    }),catchError(this.handleError))
  }

  creeatesideBar(body:any){
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type':  'application/json'
      })
    };
    var api_url = this.api_url;
    console.log(body);
    return this.http.put<any>(api_url, body, httpOptions)
    .pipe(map(sidebar =>{
      console.log(sidebar);
    }),catchError(this.handleError))
  }
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

  linkGmail(userEmail){
      var url = this.baseUrl + '/integrations/gmail/authorization';
      //console.log(80, url);
      return this.http.get(url, this.httpOptions).pipe(
        map(response => {
          //console.log(83, response);
          return response;
        }),
        catchError(this.handleError)
      );
  
    }

  linkBox(userEmail){
      var url = this.baseUrl + '/box/authorize';
      return this.http.get(url, this.httpOptions).pipe(
        map(response => {
          //console.log(83, response);
          return response;
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

  //WRITE BY IMRAN

  // for get account Navigation
  getUserSettings() {
    var api_url = this.baseUrl + '/settings';
    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        console.log(120, response);
        return response;
      }),
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };




}