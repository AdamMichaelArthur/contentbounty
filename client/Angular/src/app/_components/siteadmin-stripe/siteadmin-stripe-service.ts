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

export class SiteadminStripeService {

	clientSecret: any;

  constructor(private http: HttpClient, private cookieService:CookieService, private router: Router) {

	}

  private baseUrl=environment.apiBase
  private api_url = this.baseUrl+'/stripe';

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json'
    }),
    withCredentials: true
  };

  getPaymentIntent() {
    var api_url = this.baseUrl+'/stripe/createPaymentIntent';
    console.log(api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }
  
  //Plan
  getPlansList() {
    var api_url = this.baseUrl+'/stripe/plans';
    console.log(api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  addPlan(plan:any) {
    var api_url = this.baseUrl+'/stripe/plan';
    console.log(api_url);
    return this.http.post(api_url, plan, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  deletePlansList(id:string) {
    var api_url = this.baseUrl+'/stripe/plan/id/';
    console.log(api_url);
    return this.http.delete(api_url+id, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  //Product
  getProductList() {
    var api_url = this.baseUrl+'/stripe/products';
    console.log(api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  addProduct(product:any) {
    var api_url = this.baseUrl+'/stripe/product';
    console.log(api_url);
    return this.http.post(api_url, product, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  deleteProduct(id:string) {
    var api_url = this.baseUrl+'/stripe/product/id/';
    console.log(api_url);
    return this.http.delete(api_url+id, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
    }
    return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };


}