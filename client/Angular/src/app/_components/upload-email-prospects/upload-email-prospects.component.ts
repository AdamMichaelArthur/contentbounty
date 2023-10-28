import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { Location } from '@angular/common'
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-upload-email-prospects',
  templateUrl: './upload-email-prospects.component.html',
  styleUrls: ['./upload-email-prospects.component.css']
})

export class UploadEmailProspectsComponent extends BaseComponent implements OnInit {

  loadFlextable: boolean = false;
  filterStr = "";
  bounty_id = ""
  brand_id = ""
  brand = {}
  bounty = {}
  bountyStep = {}

  constructor(public service: BaseService, public elementRef: ElementRef,
    public sharedService: SharedService, private location: Location, public http: HttpClient){
  	super(service, elementRef)
  }

  validation = {
    "sheets":[
       {
          "tag":"upload_domains",
          "primary_key":"Email address",
          "method":"update",
          "default":true,
          "exclude_search":["bounty_id", "owner", "created_by", "modified_by"],
          "preprocessing":"filterhunterinput",
          //"exclude_update":"bounty_id"
       }
    ]
  }

  ngOnInit(): void {

  	this.bounty_id = this.sharedService["_id"];

  	console.log(28, this.sharedService._variableData)
    this.bountyStep = this.sharedService._variableData

  	this.service.brandDataFromBountyId(this.bounty_id).subscribe(data => {
       this.brand = data["brand"];
       this.bounty = data["bounty"];
       this.brand_id =  this.brand["_id"]
       this.filterStr = `{ "brand_id": "${this.brand_id}", "bounty_id":"${this.bounty_id}" }`
       console.log(39, this.filterStr);
       this.loadFlextable = true;

    });

  }

  public baseUrl = environment.apiBase

  flextableHeaderButtonClicked($event){
    
    if($event == "Download Referring Pages"){

        var api_url = this.baseUrl + `/actions/datasource/referring_domains/action/downloadreferringpages?filter=${btoa(this.filterStr)}`;
        console.log(59, api_url)
        window.open(api_url);
    }

    if($event == "Complete Bounty"){
      this.completeBounty($event);
      return;
    }

    //super.flextableHeaderButtonClicked(event);

  }

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
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    return throwError(`${JSON.stringify(error)}`);
  };

    completeBounty($event){

      var body = { ... this.bountyStep }
      body["id"] = this.bounty["_id"];
      this.service.completeBountyFromSpecialtyComponent(body).subscribe(data => {
         console.log(53, data);
         this.location.back()
      });

  }

}
