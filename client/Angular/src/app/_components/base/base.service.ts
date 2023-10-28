
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { map, take, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';

@Injectable({
  providedIn: 'root'
})

export class BaseService {

  public datasourceUrl: any = "";

  constructor(public http: HttpClient, public cookieService: CookieService, public router: Router) {

  }

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

  // profile image update code by Noor

  private subject = new Subject<any>();

  updateProfileImage(imageUrl) {
    this.subject.next({ imageUrl: imageUrl });
    console.log("trying to change profile image")
  }

  getProfileImage(): Observable<any> {
    console.log("subscribing to change of profile image")
    return this.subject.asObservable();
  }

  // profile image update code by Noor

  // first name update code by Noor

  private subjectFirstName = new Subject<any>();

  updateFirstName(first_name) {
    this.subjectFirstName.next({ first_name: first_name });
  }

  getFirstName(): Observable<any> {
    return this.subjectFirstName.asObservable();
  }

  // first name update code by Noor

  checkOutBalance() {
    var api_url = this.baseUrl + '/actions/datasource/user/action/balance'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  last_post_body = null
  last_aggregate_body = null

  getInitialDataTableList(key, maxrecords = 0, columns = "", all = "", filter = "", sort = "", aggregate: any = false) {

    var max_records: any = "";
    this.key = key;
    if (maxrecords > 0)
      max_records = "/max_records/" + String(maxrecords);
    else
      max_records = "";

    if (all != "")
      all = all + "/";

    var post = false;
    var postBody = {}

    if (aggregate != false) {
      key = key + "/aggregate/";
      post = true;
      postBody = {
        "aggregate": btoa(aggregate)
      }
      this.last_post_body = postBody
      this.last_aggregate_body = postBody;
    }

    var api_url = this.baseUrl + '/datasource/' + key + max_records + "/" + all

    if (filter != "") {
      api_url = api_url + "filter/" + btoa(filter)
    }

    if (sort != "") {
      api_url = api_url + "/sort/" + btoa(sort)
    }

    this.datasourceUrl = api_url;

    if (columns.length > 0) {
      // Reset the headers
      this.httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };

      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);
    }

    if (post == false) {
      return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
      }), catchError(this.handleError))
    }
    else {

      return this.http.post(api_url, postBody, this.httpOptions).pipe(map(response => {
        return response
      }), catchError(this.handleError))
    }
  }

  getAggregateCount(key, maxrecords = 0, columns = "", all = "", filter = "", sort = "", aggregate: any = false) {

    var max_records: any = "";
    this.key = key;
    if (maxrecords > 0)
      max_records = "/max_records/" + String(maxrecords);
    else
      max_records = "";

    if (all != "")
      all = all + "/";

    var post = false;
    var postBody = {}

      key = key + "/count/";
      post = true;
      postBody = {
        "aggregate": btoa(aggregate)
      }

    var api_url = this.baseUrl + '/datasource/' + key + max_records + "/" + all

    if (filter != "") {
      api_url = api_url + "filter/" + btoa(filter)
    }

    if (sort != "") {
      api_url = api_url + "/sort/" + btoa(sort)
    }

    this.datasourceUrl = api_url;

    if (columns.length > 0) {
      // Reset the headers
      this.httpOptions = {
        headers: new HttpHeaders({
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        "withCredentials": true
      };

      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);
    }

    this.last_aggregate_body = postBody
      return this.http.post(api_url, postBody, this.httpOptions).pipe(map(response => {
        return response
      }), catchError(this.handleError))

  }

  getFilterOptions(filter, advanced = null) {

    var all = "";

    if (advanced == null) {
      if (typeof filter.all != 'undefined') {
        if (filter.all == false) {
          all = "";
        } else {
          all = "all"
        }
      }
    } else {
      all = advanced
    }

    if (filter.all == false) {
      all = "";
    }
    // This retrieves any filter options if the filters array is set.
    var api_url = this.baseUrl + '/datasource/' + filter.datasource + "/distinct" + "/" + filter.distinct + "/" + all
    console.log(138, api_url);

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  loadingDataTablePagination(url, columns = "") {
    console.log(96, 'loadingDataTablePagination', url, this.baseUrl, columns)


    if(columns.length > 0){
      // Reset the headers
      this.httpOptions = {
            headers: new HttpHeaders({
              'accept': 'application/json',
              'Content-Type': 'application/json'
            }),
            "withCredentials": true
      };

      console.log(70, columns);
      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);
    }
    //if(this.sharedService.xbody != 'undefined')

    this.datasourceUrl = url;
    if(this.last_aggregate_body != null){

      console.log(244, url, 'Posting Aggregate', this.last_aggregate_body);
      
      return this.http.post(url, this.last_aggregate_body, this.httpOptions).pipe(map(response => {
        return response
      }), catchError(this.handleError))

    }

    return this.http.get(url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }

  deleteById(id) {
    var key = this.key
    var api_url = this.baseUrl + '/datasource/' + key + '/id/' + id;
    console.log(api_url)
    return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }


  downloadFile() {
    var key = 'salma'
    var api_url = this.baseUrl + '/datasource/export/' + key;
    console.log(api_url);
    // const filename = 'file.xls';
    const httpOptionssss = {
      headers: new HttpHeaders({
        'accept': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };
    return this.http.get(api_url, httpOptionssss).pipe(map(response => {
      console.log("Response from service file !!")
      console.log(response)
      return response
    }), catchError(this.handleError))
  }

  duplicateById(id) {
    var key = this.key
    var api_url = this.baseUrl + '/datasource/' + key + '/clone/id/' + id;
    console.log(api_url)
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))
  }


  editDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;
    console.log(188, api_url, id, body);
    return this.http.patch(api_url, body, this.httpOptions).pipe(
      timeout(3000),
      map(response => {

      return response
    }), catchError(this.handleError))
  }

  putDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;
    console.log(188, api_url, id, body);
    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

  addDataById(id, body) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/id/' + id;

    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

  searchValueInList(values, key, header, all =false, aggregate: any =false) {

    var header = header
    var api_url = this.baseUrl + '/datasource/' + this.key + '/search/' + header + '/' + values;

    if(all != false){
      api_url = api_url + "/all/" + all;
    }

    if(aggregate != false){
      api_url = api_url + /searchaggregate/ + btoa(aggregate)
    }

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }


  httpOptionsForExcel = {
    headers: new HttpHeaders({
      accept: 'application/x-www-form-urlencoded'
    }),
    withCredentials: true
  }

  uploadExcelFile(body, params = "", extraParams = null) {

    console.log(274, body);
    //console.log(275, params)
    //console.log(276, extraParams)
    //console.log(body);
    
    const formData = new FormData();

    //formData.append('spreadsheet', body);

    for  (var i =  0; i <  body.length; i++)  {  
      formData.append("file[]",  body[i]);
  } 

    if (extraParams != null) {
      var newObj = { ...JSON.parse(params), ...extraParams };
      params = JSON.stringify(newObj);
    }

    console.log(270, extraParams, newObj, params);

    var api_url = this.baseUrl + '/datasource/import/' + this.key
    if (params.length > 0) {

      api_url += ("?params=" + btoa(params))
    }
    console.log(175, api_url);

    this.last_post_body = formData;

    return this.http.post(api_url, formData, this.httpOptionsForExcel).pipe(
      map(response => {
        this.getInitialDataTableList(this.key)
        console.log(JSON.stringify(response))
        return response;
      }),
      catchError(this.handleError)
    );
  }

  addDataToSourceForm(body, filters = null) {
    var api_url = this.baseUrl + '/datasource/' + this.key
    if (filters != null) {
      body = {
        ...body,
        ...filters
      }
    }
    console.log(162, api_url);
    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  private item: any = '';

  setDataSourceValue(item: any) {
    this.item = item;
  }

  getDataSourceValue() {

    console.log(this.item + "from flex table service !!")
    return this.item;
  }

  /*
      This calls an API function that will remove a key/value pair
      from a MongoDC document (documentId)

      This is intended to provide a selective and document-level removal
      of a specific key/value pair.  The use case is syncronizing dragdrop
      operations with backend documents
  */
  removeKeyValueFromDocument(key, documentId) {

  }

  public getDistinctArray(datasource, distinct, all = true) {
    var key = datasource;
    // /actions/datasource/bountytest/action/testmes/id/12345
    var getAll = "/all";
    if (all == false)
      getAll = '';

    var api_url = this.baseUrl + '/datasource/' + key + '/distinct/' + distinct + getAll;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctArrayWithIds(datasource, distinct, all = true) {
    var key = datasource;
    // /actions/datasource/bountytest/action/testmes/id/12345
    var getAll = "/all";
    if (all == false)
      getAll = '';

    var api_url = this.baseUrl + '/datasource/' + key + '/distinctids/' + distinct + getAll;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctArrayWithFilter(datasource, distinct, filter) {
    var key = datasource;

    var api_url = this.baseUrl + '/datasource/' + key + '/distinct/' + distinct;

    this.last_post_body = filter;
    return this.http.post(api_url, filter, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctArrayWithIdsAndFilter(datasource, distinct, filter) {
    var key = datasource;

    var api_url = this.baseUrl + '/datasource/' + key + '/distinctids/' + distinct;

    this.last_post_body = filter
    return this.http.post(api_url, filter, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getDistinctTemplateById(datasource, distinct) {
    var key = datasource;

    var api_url = this.baseUrl + '/datasource/' + key + '/id/' + distinct;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getArray(datasource, filter = null, all = true, max = null) {
    var key = datasource;
    // /actions/datasource/bountytest/action/testmes/id/12345
    var getAll = "/all";
    if (all == false)
      getAll = '';


    var api_url = this.baseUrl + '/datasource/' + key + getAll;
    if (max != null) {
      api_url += "/max_records/" + String(max)
    }

    if (filter != "") {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        console.log(213, response["datasource"]);
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }

  public getArrayWithSort(datasource, filter = null, all = true, max = null, sort =null, columns ="") {
    var key = datasource;

    // /actions/datasource/bountytest/action/testmes/id/12345
    var getAll = "/all";
    if (all == false)
      getAll = '';


    var api_url = this.baseUrl + '/datasource/' + key + getAll;
    if (max != null) {
      api_url += "/max_records/" + String(max)
    }

    if (filter != "") {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    if(sort != null){
      api_url = api_url + "/sort/" + btoa(JSON.stringify(sort))
      console.log(495, sort)
    }

    if(columns.length > 0)
      this.httpOptions.headers = this.httpOptions.headers.append("x-body", columns);

    //console.log(526, datasource)

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        //console.log(213, datasource, response["datasource"]);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  public addToArray(id, key, value, pluralize = false) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/array' + '/id/' + id;
    console.log(351, api_url)
    if (pluralize == true)
      api_url += "/pluralize";

    this.last_post_body = { "key": key, "value": value }
    return this.http.post(api_url, { "key": key, "value": value }, this.httpOptions).pipe(
      map(response => {

        return response;
      }),
      catchError(this.handleError)
    );
  }

  public pullFromArray(id, key, value, pluralize = false) {
    var api_url = this.baseUrl + '/datasource/' + this.key + '/arrayrm' + '/id/' + id;

    if (pluralize == true)
      api_url += "/pluralize";

    this.last_post_body = { "key": key, "value": value }
    return this.http.post(api_url, { "key": key, "value": value }, this.httpOptions).pipe(
      map(response => {

        return response;
      }),
      catchError(this.handleError)
    );
  }

  public getAllUsersForAccount(key) {
    var key = key;
    // /actions/datasource/bountytest/action/testmes/id/12345
    var body = [
      "email",
      "first_name",
      "last_name"
    ]

    var api_url = this.baseUrl + '/datasource/' + key + "/owner/";

    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response["users"];
      }),
      catchError(this.handleError)
    );
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     console.error('An error occurred:', error.error.message);
  //   } else {}
  //   return throwError(`${JSON.stringify(error.error.ErrorDetails)}`);
  // };

  public handleError(error: HttpErrorResponse) {
    console.log(282, error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network err  or occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // console.log(510, error.error.ErrorDetails.Description)
    var errorMessage = error.error.ErrorDetails.Description
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    // return throwError(`${JSON.stringify(error)}`);
    if(errorMessage)
    {
      return throwError(error.error)
    }
    else{
      return throwError(`${JSON.stringify(error)}`); 
    }
  };

  dynamicButton(datasource: string, id: string, action: string, selectedRowData: object = null) {
    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + action.toLowerCase() + '/id/' + id;

    //console.log(342, "Dynamic Button", selectedRowData)
    if (selectedRowData == null) {
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      this.last_post_body = selectedRowData
      return this.http.post(api_url, selectedRowData, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  }

  // When you don't need the database you can use this
  genericAction(action, payload =null) {

    var api_url = this.baseUrl + '/actions/datasource/bounties/action/' + action.toLowerCase();

    console.log(688, payload);
    
    //console.log(342, "Dynamic Button", selectedRowData)
    if (payload == null) {
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      this.last_post_body = payload;
      return this.http.post(api_url, payload, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  }

  rowSelected(datasource: string, id: string) {
    console.log("OKLOLO")

    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + "selection" + '/id/' + id;

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        console.log(504, response)
        return response;
      }),
      catchError(this.handleError)
    );


  }

  deleteSelected() {
    var key = this.key
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + "deleteselected";

    console.log(546, api_url)
    return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
      return response
    }), catchError(this.handleError))

  }

  postAction(datasource, action: string, body = {}) {
    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + action.toLowerCase();

    console.log(388, api_url, body);

    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        console.log(293, response);
        return response;
      }),
      catchError(this.handleError)
    );

    console.log(398)
  }

  headerButton(datasource: string, action: string, data: object = null) {
    var key = datasource;
    var api_url = this.baseUrl + '/actions/datasource/' + key + '/action/' + action.toLowerCase();

    if (data == null) {
      return this.http.get(api_url, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    } else {
      this.last_post_body = data;
      return this.http.post(api_url, data, this.httpOptions).pipe(
        map(response => {
          return response;
        }),
        catchError(this.handleError)
      );
    }
  }

  updateDate(datasource: string, _id: string, _dateKey: string, _newDateValue: string) {
    console.log("Calling update calendar");
    var api_url = this.baseUrl + '/datasource/' + datasource + "/calendar"
    var pBody = {
      "_id": _id,
      "_dateValue": _newDateValue,
      "_dateKey": _dateKey,
    }
    this.last_post_body = pBody
    return this.http.post(api_url, pBody, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  addTeamUser(body: any) {
    var api_url = this.baseUrl + '/user'
    body.role = "administrator";
    if (body.change_password == "")
      body.change_password = false;
    delete body.cfpassword;
    this.last_post_body = body;
    return this.http.post(api_url, body, this.httpOptions).pipe(
      map(response => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  getKeysForSearchQuery(datasource: any, searchQuery: any) {
    var api_url = this.baseUrl + '/datasource/' + datasource + "/" + datasource + "/getkeys"
    this.last_post_body = searchQuery
    return this.http.post(api_url, searchQuery, this.httpOptions).pipe(map(response => {
      return response
    }))
  }

  addPaymentMethod(paymentMethod) {
    var api_url = this.baseUrl + '/stripe/method'
    this.last_post_body = { "paymentMethod": paymentMethod }
    return this.http.post(api_url, { "paymentMethod": paymentMethod }, this.httpOptions).pipe(map(response => {
      console.log(typeof response)
      return response
    }))
  }

  brandDataFromBountyId(bounty_id) {
    var api_url = this.baseUrl + '/actions/datasource/bounties/action/getbrandfrombounty'
    return this.http.post(api_url, { "bounty_id": bounty_id }, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  completeBountyFromSpecialtyComponent(body) {
    var api_url = this.baseUrl + '/actions/datasource/bounties/action/complete/id/' + body["_id"]
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  getNextSelectedItem(collectionName, id = 0) {
    var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/nextselected'
    if (id != 0) {
      api_url = api_url + "/id/" + id;
    }

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  getPrevSelectedItem(collectionName, id = 0) {
    var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/prevselected'
    if (id != 0) {
      api_url = api_url + "/id/" + id;
    }

    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  getSelectedMergeFields(collectionName) {
    console.log(687, "Darasaz")
    var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/mergefields'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))
  }

  // getEmailMergeFields(collectionName) {
  //   console.log(687, "Darasaz")
  //   var api_url = this.baseUrl + '/datasource/' + collectionName + '/action/emailfields'
  //   return this.http.get(api_url, this.httpOptions).pipe(map(response => {
  //     {
  //       return response
  //     }
  //   }), catchError(this.handleError))
  // }

  choose_template() {
    var api_url = this.baseUrl + '/datasource/templates'
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  choose_template_pagination(page_endpoint) {
    var api_url = page_endpoint
    return this.http.get(api_url, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }


  save_template(body) {
    var api_url = this.baseUrl + '/datasource/templates'
    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {
      {
        return response
      }
    }), catchError(this.handleError))

  }

  linkGmail(emailFormInfo) {
    var url = this.baseUrl + '/integrations/gmail/authorization';
    //console.log(80, url);
    return this.http.post(url, emailFormInfo, this.httpOptions).pipe(
      map(response => {
        //console.log(83, response);
        return response;
      }),
      catchError(this.handleError)
    );

  }

  email_address(brand_id:any) {
    console.log(725, brand_id)
    console.log("Here....")
    var api_url = this.baseUrl + '/actions/datasource/gmails/action/getbrandgmailaccounts'
    console.log(80, api_url);

    return this.http.post(api_url, { "brand_id": brand_id } ,this.httpOptions).pipe(map(response => {

      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  startin_percampaign(body:any){
    console.log("Here startin_percampaign ....")
    var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/startsnipercampaign'
    console.log(80, api_url);
    return this.http.post(api_url, body,this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))

  }

  sendSniperEmails(body) {

    var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/sendsniperemail';

    console.log(api_url);

    return this.http.post(api_url, body, this.httpOptions).pipe(map(response => {

      return response
    }), catchError(this.handleError))
  }

/*
  public getArray(datasource, filter = null, all = true, max = null) {
    var key = datasource;
    // /actions/datasource/bountytest/action/testmes/id/12345
    var getAll = "/all";
    if (all == false)
      getAll = '';


    var api_url = this.baseUrl + '/datasource/' + key + getAll;
    if (max != null) {
      api_url += "/max_records/" + String(max)
    }

    if (filter != "") {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    return this.http.get(api_url, this.httpOptions).pipe(
      map(response => {
        console.log(213, response["datasource"]);
        return response[response["datasource"]];
      }),
      catchError(this.handleError)
    );
  }
*/

  // Returns a list of data by collection that is owned by this particular user
  getAnyList(collection, pages =1000, endpoint =null, filter =null){

      var api_url = this.baseUrl + `/datasource/${collection}/max_records/${pages}`

      if(endpoint != null){
        api_url = endpoint
      }
      
    console.log(951, api_url)

    if(filter != null) {
      api_url = api_url + "/filter/" + btoa(JSON.stringify(filter))
    }

    console.log(955, api_url)

      return this.http.get(api_url, this.httpOptions).pipe(map(response => {
        return response
      }), catchError(this.handleError))
    }

  // Allows you to insert any data you want into a collection.  By default this data is only available
  // for this particular user.  
  postAnyData(collection, body){
    var api_url = this.baseUrl + `/datasource/${collection}`
    console.log(80, api_url);
    return this.http.post(api_url, body,this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  // Allows you to take any data you have and update it -- as long as the data is owned by the 
  // currently logged in user
  updateAnyDataById(collection, body, _id){
    var api_url = this.baseUrl + `/datasource/${collection}/id/${_id}`
    console.log(80, api_url);
    return this.http.put(api_url, body,this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  bulkInsertNewData(collection, itemsAr){

    var api_url = this.baseUrl + `/datasource/${collection}/bulk/`
    console.log(80, api_url, itemsAr);
    return this.http.post(api_url, itemsAr, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  // Allows you to get any data by id -- as long as this data is owned by the user  by the 
  // currently logged in user.
  getAnyDataById(collection, body, _id){
    var api_url = this.baseUrl + `/datasource/${collection}/id/${_id}`
    console.log(80, api_url);
    return this.http.put(api_url, body, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  // Allows you to delete any data by id -- as long as this data is owned by the user  by the 
  // currently logged in user.  Will produce an error if the data trying to be deleted isn't
  // owned by the currently logged in user
  deleteAnyDataById(collection, _id){
    var api_url = this.baseUrl + `/datasource/${collection}/id/${_id}`
    console.log(80, api_url);
    return this.http.delete(api_url).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  /*  Google Services
   *  Docs, Sheets, Presentations, Gmail
   *
  */

  /*  createSpreadsheet
   *  Creates a New Google Spreadsheet and returns the Spreadsheet ID
   *
   *  Endpoint Defined In: api/classes/integrations/google/sheets/endpoints.js
   *  Implementation: api/classes/integrations/google/sheets/sheets.js
   *  Postman Example: Content Bounty Organized/Integrations/Google/Sheets/Create Spreadsheet
  */
  createSpreadsheet(title =""){
    var api_url = this.baseUrl + `/google/sheets/createSpreadsheet`

    return this.http.post(api_url, {"title": title }, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

  createDocument(title =""){
    var api_url = this.baseUrl + `/google/sheets/createSpreadsheet`

    return this.http.post(api_url, {"title": title }, this.httpOptions).pipe(map(response => {
      {
        console.log(response)
        return response
      }
    }), catchError(this.handleError))
  }

}

