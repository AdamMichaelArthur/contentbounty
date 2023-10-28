import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { FlexibleTableService } from "../flexible-table/services/flexible-table-service"
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, take, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-bounty-checkin',
  templateUrl: './bounty-checkin.component.html',
  styleUrls: ['./bounty-checkin.component.scss']
})

export class BountyCheckinComponent extends BaseComponent implements OnInit  {
	
  skills = ""

  private socket;
  public SERVER_URL = environment.websocketBase;

  refreshTable() {
    console.log("Refreshing FlexTable");
    this.flexTable.refreshTableData()
  }

  tableButtonClicked($event){
    console.log(27, "tableButtonClicked", $event);
    if($event.button == "Files"){
      return super.tableButtonClicked($event)
    }

    super.tableButtonClicked($event);
    this.refreshTable()
  }

  isoDateString = new Date().toISOString()
  
  aggregateStr = `[
      { "$match" : { "release_for_bounty": { "$lte": "${this.isoDateString}" } } },
      { "$match" : { "owner" : { $eq: $res.locals.user.accountId } } },
      { $project:{
          brand_name:1,
          content_type:1,
          pipeline:1,
          keywords:1,
          process:1
      }},
      {"$unwind":"$process"},
      {"$match":
        { "$and":
          [  
            {"process.bStatus": true},
            {"process.pipeline":"unclaimed"},
            {"process.checkin":{ $ne: false } }
          ]
        }
      },
      { $project:{

          brand_name:1,  
          content_type:1,
          bounty:"$process.bounty",
          refDocId:"$process.refDocId",
          name:"$process.name",
          description:"$process.description",
          pipeline:1,
          keywords:1,
          completion_order:"$process.completion_order"
      }},
      { 
        $replaceRoot: 
          { 
              newRoot: 
                { 
                  $mergeObjects: 
                    [ 
                      { 
                        _id: "$_id", 
                        brand_name: "$brand_name", 
                        content_type:"$content_type",
                        pipeline:"$pipeline",
                        keywords:"$keywords",
                        bounty:"$bounty",
                        name:"$name",
                        description:"$description",
                        completion_order:"$completion_order",
                        refDocId:"$refDocId"

                      } 
                    ] 
                } 
          }
      }
  ]`


  ngOnInit(): void {
  }

  receivedTableData($event){
    
  }
}
