import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'

@Component({
  selector: 'app-link-building',
  templateUrl: './link-building.component.html',
  styleUrls: ['./link-building.component.css']
})

export class LinkBuildingComponent extends BaseComponent implements OnInit {

  validation = {
    "sheets":[
       {
          "tag":"manual_keyword_upload",
          "primary_key":"Keyword",
          "method":"update",
          "default":true,
          "preprocessing":"manual_keyword_upload_for_linkbuilding"
       }
    ]
  }


  textCutoff = [0, 30, 20, 10, 20, 20]

  unusedKeywords: boolean = false
  selected: any = ''
  myDate: any
  isLoading:boolean = false
    brands = [];
  viewMode = 'process';
  data:any = [];
  sections: any;

 bountyTemplate: Array<any> = [];
   inhouseUsers = []

  selectedLevel;

  displayProcess = false;
  displayTableButtonArea = false;

  currentBrand: any = "";
  currentBrandId: any = "";
  currentBounty: any = {}
  selectedProcess = ""
  campaignTypes:Array<Object> = [
      {id: 0, name: "Select Outreach Strategy", "process":null},
      {id: 1, name: "Bulk Outreach (Shotgun)", "process":"Shotgun Skyscraper"}, 
      {id: 2, name: "Guest Posting", "process":"guestposting"},
      {id: 3, name: "Skyscraper", "process":"skyscraper"},
  ];

  constructor(public service: BaseService, public elementRef: ElementRef, public sharedService: SharedService) { 
  	super(service, elementRef) 
    this.selectedLevel = this.campaignTypes[0]
  }

  flextableHeaderButtonClicked(buttonName: any) {

    if(buttonName == "Select All"){

    //   this.service.headerButton("keywords", "selectallkeywords", { ... JSON.parse(this.filterStr), "key":"keywords" }).subscribe(
    //           (data: any) => {
    //             console.log(43, data);
    //             this.refreshFlextable()
    //           }
    //         )

    //   return;
    };


    this.displayButtonArea = true;
    this.buttonSubviews[0] = true;
    console.log(30, "flextable header button clicked")

      this.unusedKeywords = true;
      this.inhouseUsers = []
      var content_type = "Link Building";

      var sections = []


  }


  ngOnInit(): void {
  	super.ngOnInit()
    this.displayButtonArea = false;
    this.buttonSubviews[0] = false;
  	console.log(21, this.sharedService);
  }

  disapparePopup(){


  }

  
  onSelected(){
    console.log(this.selectedLevel)
    this.displayTableButtonArea = true;
    this.selectedProcess = this.selectedLevel.process
    this.displayProcess = true;
  }

  addGuide($event){
        const addProcess = $event
    this.hidePopup()

    console.log($event);
    var postBody = $event[0];
    delete postBody.additional_instruction;
    delete postBody.bounty;
    delete postBody.dropboxLink;
    delete postBody.promptLists;

    postBody["brand_id"] = this.sharedService._id
    postBody["brand_name"] = this.sharedService._variableData["brand_name"]
    postBody["frequency"] = "daily";
    console.log(159, postBody)
    this.service.headerButton("bounties", "linksfromselectedpages", postBody).subscribe(
              (data: any) => {
                 console.log(122, "Response", data);
                 this.isLoading = false
                 
                 alert("Bounties have been created")
              }
            )
  }
  hidePopup(){
    this.displayButtonArea = false
  }
}
