/*
    Reviewed 12/21/2019 by Adam Arthur
  
    loadpagi(url) -- this function contains a spelling error, and should be
    camelCase, i.e. loadPage(url)
*/

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

export class QueueService {

	menuItems: any[];

  constructor(private http: HttpClient, private cookieService:CookieService, private router: Router) {

	}

  private baseUrl=environment.apiBase
  private api_url = this.baseUrl+'/datasource/brand';

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json'
    }),
    withCredentials: true
  };


  // getdatasorce

  getDataSource(key) {
    var api_url = this.baseUrl+'/datasource/'+ key;
    console.log(api_url);
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  loadpagi(url){
    return this.http.get(url, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))

  }


  getQueue() {
    var api_url = this.api_url;
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
    }),catchError(this.handleError))
  }

  update(key:any, value:any, id){

    console.log(41, "testing get method")
    return this.http.patch(`${this.api_url}/datasource/brand/id/${id}`, {
      key:"brand",
      value:value,
    },
    this.httpOptions);

    // var api_url = this.api_url;
    // console.log(41,key, value, id, api_url)
    // this.http.get(api_url, this.httpOptions).pipe(map(response => {
    //     return response
    // }),catchError(this.handleError))

    // console.log("get call finished")
    // //return;

    // var api_url = `${this.api_url}/id/${id}`
    // console.log(41, api_url)
    // var body = {
    //   "key":key,
    //   "value":value
    // };
    // console.log(45, body, api_url);
    // this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
    //     return response
    // }),catchError(this.handleError))

    // return this.http.patch(api_url, body, this.httpOptions).pipe(map(response => {
    //     return response
    // }),catchError(this.handleError))
  }

  createQueue(body:any){

    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type':  'application/json'
      })
    };

    var api_url = this.api_url;
    console.log(body);
    return this.http.post<any>(api_url, body, httpOptions)
    .pipe(map(sidebar =>{
      console.log(sidebar);
    }),catchError(this.handleError))

  }

  //Writen By Imran
  // Add Brand
  addBrand(body) {
    var api_url = this.baseUrl + '/datasource/brand'
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  // Get Brand
  getBrand() {
    var api_url = this.baseUrl + '/datasource/brand/distinct/Brand Name'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  // Get Brand Search
  getBrandSearch(brand_name, key) {
    var api_url = this.baseUrl + '/datasource/'+key+'/search/Brand Name/' + brand_name
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  //Writen By Imran end

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
    }
    return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };
}