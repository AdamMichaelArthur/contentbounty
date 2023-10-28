import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map,take,catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SearchBountyService {


  constructor(private http: HttpClient, private cookieService:CookieService, private router: Router) { }

  private baseUrl=environment.apiBase
  private api_url = this.baseUrl+'/datasource/brand';

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json'
    }),
    withCredentials: true
  };


  // Get Bounty
  getBounty() {
    var key = 'imran';
    var api_url = this.baseUrl + '/datasource/' + key
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  // Post Creator
  submitCreatorsBounty(body) {
    var key = 'creatorsbounty';
    var api_url = this.baseUrl + '/datasource/' + key
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // addDataToSourceForm(body) {
  //   console.log(body);
  //   var key = 'imran';
  //   var api_url = this.baseUrl + '/datasource/' + key
  //   return this.http.post(api_url, body, this.httpOptions).pipe(
  //     map(response => {
  //       return response;
  //     }),
  //     catchError(this.handleError)
  //   );
  // }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
    }
    return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };
}