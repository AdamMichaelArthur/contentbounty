// Input, ViewChild
import { Component, OnInit, Input, Output, ElementRef, ViewChild, ViewChildren, QueryList, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'
import { Globals } from 'src/app/globals';


@Component({
  selector: 'app-sniper-emails',
  templateUrl: './sniper-emails.component.html',
  styleUrls: ['./sniper-emails.component.css']
})
export class SniperEmailsComponent extends BaseComponent implements OnInit {

  sendEmailsData: any;
  isLoading = true;
  

  @Output() public emailSentSuccessfully = new EventEmitter<any>();

  constructor(public service: BaseService, public elementRef: ElementRef, public globalVars: Globals) {
    super(service, elementRef) 
    this.globalVars.isLoading = true
  }

  emails = [];
  emailCount = 0;
  noEmails = false;
  // aggregateStr = `[
  //     {"$lookup":{
  //         "from":"keywords",
  //         "localField":"bounty_id",
  //         "foreignField":"linkcampaign_id",
  //         "as":"keyword"
  //     }},
  //     {"$unwind":"$keyword"},
  //     { "$match": { "strategy" :"sniper", 
  //       "emails.outbound": { "$exists": true, "$size": 0 },
  //       "emails.inbound": { "$exists": true, "$size": 0 },
  //       "selected": false
  //     } },
  //     { $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT", "$keyword" ] } } },
  //     { $project: { "keyword": 0 } }
  //     ]`

  aggregateStr = `[
  {
    '$lookup': {
      from: 'keywords',
      localField: 'bounty_id',
      foreignField: 'linkcampaign_id',
      as: 'keyword'
    }
  },
  {
    '$lookup': {
      from: 'bounties',
      localField: 'keyword.bounty_id',
      foreignField: '_id',
      as: 'bounty'
    }
  },
  {
    '$lookup': {
      from: 'referring_domains',
      localField: 'sld',
      foreignField: 'sld',
      as: 'referring_domains'
    }
  },
  { '$unwind': { 'path': '$referring_domains', "preserveNullAndEmptyArrays": true } },
  { '$unwind': { 'path': '$keyword', "preserveNullAndEmptyArrays": true } },
  { '$unwind': { 'path': '$bounty', "preserveNullAndEmptyArrays": true } },
  { '$match' : { $expr: {$eq:["$brand_id", "$bounty.brand_id"] } } },
  {
    '$match': {
      strategy: 'sniper',
      'emails.outbound': { '$exists': true, '$size': 0 },
      'emails.inbound': { '$exists': true, '$size': 0 },
      'skip': { '$ne': true },
      'paytoplay' : { '$ne' : true},
      selected: false
    }
  },
  {
    '$replaceRoot': { 
      newRoot: { 
        '$mergeObjects': [ 
        '$$ROOT', 
        { outreach_email_id: "$$ROOT._id" }, 
        '$keyword', '$referring_domains', {published_link: "$bounty.published_link"},
        {brand_id: "$bounty.brand_id"}
        ] } }
  },
  { $project: { "keyword": 0, "bounty": 0, "referring_domains": 0 } }
]`

  datasource = "outreach_emails"
  errorMessage = ""

  ngOnInit(): void {

    // I did not understand this piece of code


    this.emailSentSuccessfully.subscribe(data => {
      console.log(108, "Sent Event Received")
      this.loadNextEmail()
    })

    this.loadNextEmail();

    // I did not understand this piece of code
  }

  loadNextEmail(){
    console.log(99, this.datasource)
    
    this.service.getInitialDataTableList(this.datasource, 1, '', '', '', '', this.aggregateStr).subscribe(
      (data: any) => {
      // console.log(57, data);
      console.log(113, this.emails);
        this.emails = data[this.datasource];
        if(this.emails.length == 0){
          this.noEmails = true;
          // this.isLoading = false
          this.globalVars.isLoading = false
        } else {

          this.service.getAggregateCount(this.datasource, 1, '', '', '', '', this.aggregateStr).subscribe(
            (data: any) => {
              if(data.outreach_emails){
                this.emailCount = data.outreach_emails[0].count;
              }
              // this.isLoading = false
              this.globalVars.isLoading = false
            })   
        }
        // console.log(61, this.emails);

        // commented out unnecessary code

        // var idsAr = []  
        // for(var i = 0; i < data[this.datasource].length; i++){
        //   idsAr.push(data[this.datasource][i]["_id"])

        // }

        // commented out unnecessary code
      },
      (error: any)=>{
        // this.isLoading = false;
        this.globalVars.isLoading = false
        this.errorMessage = "Something wrong! Could not get data!"
      })
  }

  // perhaps unnecessary code
  
  @Input()
  set ready(isReady: boolean) {
    console.log(123, isReady)
    if (isReady) this.dataLoaded();
  }

  dataLoaded(){

  }

  badgesEvent(event:any){
    //alert("from campaign"+" "+ event);
    console.log(event)

  }

  emailSendSuccessfully(){

  }

  emailReceived(){

  }

  // perhaps unnecessary code

}