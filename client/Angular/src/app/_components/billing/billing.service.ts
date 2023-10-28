import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BaseService } from "../base/base.service";
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class BillingService extends BaseService {

  clientSecret: any;

  constructor(public http: HttpClient, public cookieService: CookieService, public router: Router) {
    super(http, cookieService, router)
  }

  httpOptions = {
    headers: new HttpHeaders({
      accept: 'application/json'
    }),
    withCredentials: true
  };

  getPaymentIntent() {
    var api_url = this.baseUrl + '/stripe/createPaymentIntent';
    console.log(30, api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  getPaymentMethods() {
    var api_url = this.baseUrl + '/stripe/methods';
    console.log(38, api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  deletePaymentMethod(id) {
    var api_url = this.baseUrl + '/stripe/method/id/' + id;
    console.log(46, api_url);
    return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  defaultPaymentMethod(id) {
    var api_url = this.baseUrl + '/stripe/default/id/' + id;
    console.log(54, api_url);
    return this.http.post(api_url, {}, this.httpOptions).pipe(map(response => {
      console.log(56, response);
      return response
    }), catchError(this.handleError))
  }

  cancelSubscription(id) {
    var api_url = this.baseUrl + '/stripe/subscription/id/' + id;
    console.log(62, api_url);
    return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  updateSubscription(id, planId) {
    var api_url = this.baseUrl + '/stripe/subscription/id/' + id + "/plan/" + planId;
    console.log(70, api_url);
    return this.http.patch(api_url, {}, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  getPlans() {
    var api_url = this.baseUrl + '/stripe/plans';
    console.log(78, api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  getSubscriptions() {
    var api_url = this.baseUrl + '/stripe/subscriptions';
    console.log(86, api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  createSubscription(planId) {
    var api_url = this.baseUrl + '/stripe/subscription';
    console.log(94, api_url);
    return this.http.post(api_url, { "planId": planId }, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }

  //error handle
  // private handleError(error: HttpErrorResponse) {
  //   console.log(129, error);
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error.ErrorDetails)}`
  //     );
  //   }

  //   if (error.status != 0) {
  //     return throwError(error.error.ErrorDetails);
  //   }
  //   else {
  //     return throwError({ "Error": 0, "Description": "No Internet Connection!" });
  //   }
  // }
}
