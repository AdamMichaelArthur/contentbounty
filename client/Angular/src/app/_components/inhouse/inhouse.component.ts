
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
  selector: 'app-inhouse',
  templateUrl: './inhouse.component.html',
  styleUrls: ['./inhouse.component.css']
})
export class InhouseComponent extends BaseComponent implements OnInit {

  skills = ""

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
      "datasource": "processes",
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

  private socket;
  public SERVER_URL = environment.websocketBase;


  refreshTable() {
    console.log("Refreshing FlexTable");
    this.flexTable.refreshTableData()
  }

  tableButtonClicked($event){
    if($event.button == "Complete Inhouse"){
      this.refreshTable()
      return;
    }  

    if($event.button == "Claim"){
      this.refreshTable()
      return;
    }  

    super.tableButtonClicked($event);
  }

  isoDateString = new Date().toISOString()
  
  aggregateStr = `[
      { "$match" : { "release_for_bounty": { "$lte": "${this.isoDateString}" } } },
      { $project:{
          brand_name:1,
          content_type:1,
          pipeline:1,
          keywords:1,
          titles:1,
          prompts:1,
          process:1
      }},
      {"$unwind":"$process"},
      {"$match":
        { "$and":
          [  
            {"process.bStatus": true},
            {"process.pipeline":"unclaimed"},
            {"process.inhouse": $res.locals.user._id },
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
          titles:1,
          prompts:1,
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
                        titles:"$titles",
                        prompts:"$prompts",
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
    super.ngOnInit()
  }

  receivedTableData($event){
    
  }
}
