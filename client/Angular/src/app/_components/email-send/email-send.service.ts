import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { map, take, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EmailSendService {


  constructor(private http: HttpClient, private router: Router) {

  }

  private baseUrl = environment.apiBase
  // private api_url = this.baseUrl + '/datasource/brand';

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json'
    }),
    withCredentials: true
  };

  sendSniperEmails(body) {

    var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/sendsniperemail';

    console.log(api_url);

    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

  getTemplateData(template){
    var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/sendsniperemail';

    console.log(api_url);

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

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