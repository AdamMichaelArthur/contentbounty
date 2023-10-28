import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { FlexibleTableService } from "../flexible-table/services/flexible-table-service"
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, take, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-haro',
  templateUrl: './haro.component.html',
  styleUrls: ['./haro.component.css']
})

export class HaroComponent extends BaseComponent implements OnInit {

  isoDateString = new Date().toISOString()

  filters = [
    {
      "filter": { "brand_name": "" },
      "label": "Brand",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",
      "all":false
    },
    {
      "filter": { "content_type": "" },
      "label": "Content Type",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "process",
      "key": "content_type",
      "distinct": "content_type",
      "all":true
    },
    {
      "filter": { "pipeline": "" },
      "label": "Pipeline",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "bounties",
      "key": "pipeline",
      "distinct": "pipeline",
      "all":true
    }
  ]

  filterStr = `{ "Deadline": { "$gte": "${this.isoDateString}" } }`
    
  // aggregateStr = `[
  //   { "$match" : { "Deadline": { "$gte": "${this.isoDateString}" } } },
  //   { $project: { 
  //               "_id": "$_id", 
  //               "Media Outlet": "$Media Outlet", 
  //               "Category":"$Category",
  //               "Summary":"$Summary",
  //               "Name":"$Name",
  //               "Deadline":"$Deadline",
  //               "Query":"$Query"
  //   }           } 
  // ]`


  textCutoff = [20, 20, 25, 20, 30, 20]


  constructor( private router: Router,  
    public service: BaseService, public elementRef: ElementRef) 
  {
    super(service, elementRef) 
  }

  sendEmailsData = null;

  ngOnInit(): void {
    this.sendEmailsData = {
      "Body":"",
      "Email":"",
      "From":"",
      "Subject":""
    }
  }

  availableEmails = [];

    tableButtonClicked($event){
      console.log(568, $event)
        
      this.availableEmails = $event
      for(var i = 0; i < this.tableData.length; i++){
        if(this.tableData[i]._id == $event._id){
          console.log(96, this.tableData[i]);
          this.sendEmailsData["Email"] = this.tableData[i]["Email"];

          this.sendEmailsData["From"] = "";
          if($event.emails.length > 0){
            this.sendEmailsData["From"] = $event.emails[0].email;
          }

          this.sendEmailsData["Subject"] = `RE: ${this.tableData[i]["Summary"]}`

          var body = `Hi ${this.tableData[i]["Name"]},<br><br>`

          var query = this.tableData[i]["Query"].replace(/(?:\r\n|\r|\n)/g, '<br>');
          this.sendEmailsData["Body"] = body + `--------------------------------------<br><br>` + query
        }
      }

      super.tableButtonClicked($event);  
  }

  tableData = [];
  receivedTableData($event){
    this.tableData = $event;
  }
  
}
