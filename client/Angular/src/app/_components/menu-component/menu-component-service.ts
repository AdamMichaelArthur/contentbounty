import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class MenuComponentService {


  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {

  }

  private baseUrl = environment.apiBase

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json'
    }),
    withCredentials: true
  };

  add_menu(body, api_endpoint) {
    var api_url = this.baseUrl + '/navigationv2/action/' + api_endpoint
    console.log(32, api_url);
    
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        console.log(37, response)
        return response;
      }),
      catchError(this.handleError)
    );
  }

  add_

  get_menu(){
    var api_url = this.baseUrl + '/datasource/sidebarnavs/distinct/navigation/all'
    return this.http.get(api_url,this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  get_menu_pagination(url){
    var api_url = url
    return this.http.get(api_url,this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  editMenu(id,body){
  }
  deleteMenu(body){
    var api_url = this.baseUrl + '/navigationv2/action/remove'
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
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
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return throwError(`${JSON.stringify(error)}`);
  };



}