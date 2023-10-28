import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SettingService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private baseUrl = environment.apiBase;

  httpOptions = {
    headers: new HttpHeaders({
      accept: 'application/json'
    }),
    withCredentials: true
  };

  httpOptionsForExcel = {
    headers: new HttpHeaders({
      accept: 'application/x-www-form-urlencoded'
    }),
    withCredentials: true
  }

  public baseUrlVar = this.baseUrl

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

  // for get settigns
  saveSetting(key, value) {
    var api_url = this.baseUrl + '/settings';
    return this.http.post(api_url, {
      "key": key,
      "value": value
    }, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for save setting
  saveAccountSetting(body) {
    console.log(1813, body);
    var app_url = this.baseUrl + '/settings';
    console.log(54, app_url, this.httpOptions)
    return this.http.post(app_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for get settigns
  saveAdvancedSetting(object, branch, key, value) {
    console.log("Save Advanced Setting Called")
    var api_url = this.baseUrl + '/settings/advanced';
    return this.http.post(api_url, {
      "object": object,
      "branch": branch,
      "key": key,
      "value": value
    }, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for save setting advanced
  saveAccountSettingsAdvanced(body) {
    var app_url = this.baseUrl + '/settings/advanced';
    return this.http.post(app_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for save setting
  saveAccountSettings(body) {
    var app_url = this.baseUrl + '/settings/array';
    return this.http.post(app_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for send test email
  sendTestEmail(body) {
    var app_url = this.baseUrl + '/autobound/autobot/test/';
    return this.http.post(app_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  // for uploading image
  uploadImage(body) {
    console.log(126, body);
    const formData = new FormData();
    formData.append('image', body);

    var app_url = this.baseUrl + '/images/upload';
    return this.http.post(app_url, formData, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  uploadExcelFile(body) {
    console.log(body);
    const formData = new FormData();
    formData.append('spreadsheet', body);

    var app_url = this.baseUrl + '/autobound/mission_control/templates/snippets/import';
    return this.http.post(app_url, formData, this.httpOptionsForExcel).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  baseUrlForAsset = '';
  getDummyImage = this.baseUrlForAsset + '/assets/img/faces/blank_profile.png';

  //error handle
  private handleError(error: HttpErrorResponse) {
    console.log(129, error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error.ErrorDetails)}`
      );
    }

    if (error.status != 0) {
      return throwError(JSON.stringify(error.error.ErrorDetails));
    }
    else {
      return throwError(JSON.stringify({ "Error": 0, "Description": "No Internet Connection!" }));
    }
  }
}
