import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { BaseService } from '../../base/base.service'

@Injectable({
  providedIn: 'root'
})

export class FlexibleTableService extends BaseService {

  //public service: BaseService;

  constructor(public http: HttpClient, public cookieService: CookieService, public router: Router) {
  	super(http, cookieService, router)
  }
    
}