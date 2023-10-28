



import { Component, OnInit, ElementRef } from '@angular/core';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'



@Component({
  selector: 'app-siteadmin-authorities',
  templateUrl: './siteadmin-authorities.component.html',
  styleUrls: ['./siteadmin-authorities.component.css']
})
export class SiteadminAuthoritiesComponent extends BaseComponent implements OnInit {

  boxSciptUrlCss = 'https://cdn01.boxcdn.net/platform/elements/13.0.0/en-US/explorer.css'
  boxScriptUrl = 'https://cdn01.boxcdn.net/platform/elements/13.0.0/en-US/explorer.no.react.js'
  
  //polyFillScriptUrl = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,Intl'

  filters = [
    {
      "filter": { "brand_name": "" },
      "label": "Brand",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",
      "all":true
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

    aggregateStr = `[
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
            {"process.bStatus": true}
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
                        name:"$name",
                        keywords:"$keywords",
                        bounty:"$bounty",
                        description:"$description",
                        completion_order:"$completion_order",
                        refDocId:"$refDocId"

                      } 
                    ] 
                } 
          }
      }
  ]`

  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef) 
  }

  tableButtonClicked($event){
    

    super.tableButtonClicked($event)

    console.log(27, "tableButtonClicked", this.tableButtonSubviews);


    if($event.button == "Files"){
      //return super.tableButtonClicked($event)
    }
  }

  ngOnInit() {
    
  }
  textCutoff = [30, 15, 20]



}
