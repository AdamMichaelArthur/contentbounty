import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BountyDetailService {

  public baseUrl = environment.apiBase
  private api_url = this.baseUrl + '/datasource/brand';
  public key = "";

  httpOptions = {
    headers: new HttpHeaders({
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    "withCredentials": true
  };

  constructor(public http: HttpClient) { }

  getProcessSteps() {
    var api_url = this.baseUrl + '/datasource/' + 'step' + "/all" + "/distinct/step"
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  getTeamUsers() {
    var api_url = this.baseUrl + '/datasource/' + 'users'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  updateBounty(steps, id) {
    var api_url = this.baseUrl + '/actions/datasource/' + 'bounty/action/updatebounty/id/' + id
    return this.http.post(api_url, steps, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  removeStepFromOneExistingBounty(refDocId){
    var api_url = this.baseUrl + '/actions/datasource/' + 'bounty/action/removeStepFromOneExistingBounty'
    return this.http.post(api_url, {"refDocId":refDocId}, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  addStepToExistingBounty(bounty_id, step){
    var api_url = this.baseUrl + '/actions/datasource/' + 'bounty/action/addStepToExistingBounty'
    return this.http.post(api_url, {"bounty_id":bounty_id, "step": step }, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
    }
    return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  };
}
