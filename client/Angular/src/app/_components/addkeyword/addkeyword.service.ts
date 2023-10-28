import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { BaseService } from '../base/base.service'

@Injectable({
  providedIn: 'root'
})

export class AddKeywordService extends BaseService{

  public datasourceUrl: any = "";

  constructor(public http: HttpClient, public cookieService: CookieService, public router: Router) {
  	super(http, cookieService, router)
  }

  addDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;

    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {
      console.log(189, response);
      return response
    }), catchError(this.handleError))
  }

}