import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'
import { Router, CanActivate } from '@angular/router';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})

export class KeywordsComponent extends BaseComponent implements OnInit {

  @ViewChildren(FlexibleComponent) flexTables: QueryList<any>

  inhouseUsers = []

  textCutoff = [60,60,80,80,80,80,90]

  bHasCodeGenerator = true;
  code_generator_url = '';

  public columnsStr = "Keyword,Title,Volume,Difficulty,Type,Orangic,Words-Body,Words-Heading,Title,H1 Title";

  filters = [
    {
      "filter": false,
      "filterLabels": [ "All", "Deployed", "Published", "Active Link Building", "Unused" ],
      "label": "Deployed",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",
      "all":false
    }
  ]

  filterStr = '';//`{ "linkcampaign_id": { "$exists" : false }, "bKeywordDeployed": true }`

  aggregateStr = ''

  validation = {
    "sheets":[
       {
          "tag":"manual_keyword_upload",
          "primary_key":"Keyword",
          "method":"update",
          "default":true
       }
    ]
  }

  filter = "";

  constructor(public service: BaseService, public elementRef: ElementRef, public sharedService: SharedService, private router: Router)  { 
  	super(service, elementRef) 

  }

  currentBounty = {
    "brand_name":""
  };



   headerDropdownChanged($event){

     this.flexTable.filter = '';

     if($event.value == "Active Link Building"){
        this.flexTable.aggregate = `[ 
        { "$lookup": { "from": "bounties", "localField":"bounty_id","foreignField":"_id", "as": "bounty" } },
        { "$match" : { "brand_id": "${this.sharedService._variableData._id }", "linkcampaign_id": {"$exists":true } } }, 
        {"$unwind":"$bounty"},
        { $replaceRoot: { newRoot: { 
          "_id":"$_id",
          "selected":"$selected",
          "Keyword":"$Keyword",
          "content_type":"$bounty.content_type",
          "prompt":"$Prompt",
          "title":"$Title",
          "published_link ": "$bounty.published_link" 
        } } } 
      ]`
       
       this.flexTable.getInitialDataTableList();
     }


     if($event.value == "Deployed"){
        this.flexTable.aggregate = `[ 
        { "$lookup": { "from": "bounties", "localField":"bounty_id","foreignField":"_id", "as": "bounty" } },
        { "$match" : { "brand_id": "${this.sharedService._variableData._id }", "bKeywordDeployed": true, "bounty.published_link": { "$exists": false } } }, 
        {"$unwind":"$bounty"},
        { $replaceRoot: { newRoot: { 
          "_id":"$_id",
          "selected":"$selected",
          "Keyword":"$Keyword",
          "content_type":"$bounty.content_type",
          "published_link ": "$bounty.published_link" 
        } } } 
      ]`
        this.filter = '';
       this.flexTable.getInitialDataTableList();
     }

     if($event.value == "Published"){
        this.flexTable.aggregate = `[ 
        { "$lookup": { "from": "bounties", "localField":"bounty_id","foreignField":"_id", "as": "bounty" } },
        { "$match" : { "brand_id": "${this.sharedService._variableData._id }", "bounty.published_link": { "$exists": true } } }, 
        {"$unwind":"$bounty"},
        { $replaceRoot: { newRoot: { 
          "_id":"$_id",
          "selected":"$selected",
          "Keyword":"$Keyword",
          "content_type":"$bounty.content_type",
          "published_link ": "$bounty.published_link" 
        } } } 
      ]`
      this.filter = '';
      this.flexTable.columns="selected,Keyword,Content Type,published_link"
      this.flexTable.linkColumns="published_link"
      //this.flexTable.widths="0,75,50,50,50,50,550,60,600,600,600,600"
      this.flexTable.widthsAr = [0, 75, 350, 350, 800];

      
      console.log(124, this.flexTable.widthsAr)
      this.flexTable.linkColumnsAr[3] = true;
       this.flexTable.getInitialDataTableList();

     }

     if($event.value == "Unused"){
        this.flexTable.aggregate = `[ 
        { '$match': { "brand_id": "${this.sharedService._variableData._id }", bKeywordDeployed: { '$ne': true } } },
        { $replaceRoot: { newRoot: { 
          "_id":"$_id",
          "selected":"$selected",
          "Keyword":"$Keyword",
          "Volume":"$Volume",
          "Difficulty":"$Difficulty",
        } } } 
      ]`
      this.filter = '';
       this.flexTable.getInitialDataTableList();
     }

   }

  dataLoaded = false;
  ngOnInit(): void {


    super.ngOnInit()
    this.displayButtonArea = false;
    this.buttonSubviews[0] = false;

    this.filter = `{ "brand_id": "${this.sharedService._variableData._id }" }`

    this.dataLoaded = true;

    // { "$match" : { "bounty.published_link" : {$exists: true }, "linkcampaign_id": {$exists: false }, "brand_id": "${this.sharedService._variableData._id }" } }, 

  //   this.aggregateStr = `[ 
  //   { "$lookup": { "from": "bounties", "localField":"bounty_id","foreignField":"_id", "as": "bounty" } },
  //   { "$match" : { "brand_id": "${this.sharedService._variableData._id }" } }, 
  //   {"$unwind":"$bounty"},
  //   { $replaceRoot: { newRoot: { 
  //     "_id":"$_id",
  //     "selected":"$selected",
  //     "Keyword":"$Keyword",
  //     "content_type":"$bounty.content_type",
  //     "prompt":"$bounty.prompt",
  //     "title":"$bounty.title",
  //     "published_link ": "$bounty.published_link" 
  //   } } } 
  // ]`

    //this.sharedService._variableData
  }

    
        
    

  flextableHeaderButtonClicked(buttonName: any) {
    console.log(27);

    if(buttonName == "Select All"){

      this.service.headerButton("keywords", "selectallkeywords", { ... JSON.parse(this.filterStr), "key":"keywords" }).subscribe(
              (data: any) => {
                console.log(43, data);
                this.refreshFlextable()
              }
            )

      return;
    };

    if(buttonName == "Show All Columns"){

      console.log(197, this.filter)
      console.log(198, this.aggregateStr)

    var requestBody = JSON.parse(this.filter);
        this.service.getKeysForSearchQuery("keywords", requestBody).subscribe((data: any) => {
          console.log(198, data["keywords"])
      var columnsToDisplay = []
      var columnsToDisplayStr = "";
      for(var i = 0; i < data["keywords"].length; i++){
      //for (const key of Object.entries(data["keywords"][i])) {
        var key = data["keywords"][i]
        console.log(203, key)
        if(key.indexOf("_id") == -1){
          if(key.indexOf("_by") == -1){
            if(key.indexOf("owner") == -1){
              if(key.indexOf("modifiedAt") == -1){
                if(key.indexOf("selected") == -1){
                  if(key[0] != 'b'){
                  columnsToDisplayStr = columnsToDisplayStr + "," + key
                  columnsToDisplay.push(key)
        }}}}}}
        // if(voca.includes(key, "_id")){
        //   console.log(371, typeof value)
        //   console.log(372, typeof "Test");
        //   if(typeof value == "string")
        //     filter[key] = mongoose.Types.ObjectId(value)
        // }
      }
      columnsToDisplay.unshift('selected');
      //}
        console.log(218, columnsToDisplay)

          this.columnsStr = columnsToDisplay.join(",");

          this.flexTables.forEach(hello => {
               //if(hello.columns == "Keyword,Content Type,Clicks"){
                 hello.columns = columnsToDisplay.join(",");
                 hello.widthsAr = new Array(columnsToDisplay.length).fill(200);
                 console.log(201, hello)
                 hello.getInitialDataTableList()
              //}
          });
        })
        return;
      }

    this.displayButtonArea = true;
    this.buttonSubviews[0] = true;
    console.log(30, "flextable header button clicked")

      this.unusedKeywords = true;
      this.inhouseUsers = []
      var content_type = "Link Building";

      var sections = []


  }

   hidePopup(){
     console.log(27, "Hide popup", this.displayTableButtonArea)
    this.displayTableButtonArea = false
    this.buttonSubviews[0] = false

  }

  unusedKeywords: boolean = false
  selected: any = ''
  myDate: any
  isLoading:boolean = false
    brands = [];
  viewMode = 'process';
  data:any = [];
  sections: any;

 bountyTemplate: Array<any> = [];

   createBountiesBySelectedKeywords(process){

     return;

    this.isLoading = true;
    this.unusedKeywords = false;

    var steps = [];
    var stepOrder = 0;
    var content_type = "";

    for(var i = 0; i < this.data.length; i++){
      const process_step = this.data[i];

      if(process_step.process == true){
        stepOrder++;
        var step = {}
        content_type= process_step["content_type"]
        step["completion_order"] = stepOrder;
        step["name"] = process_step["step"];
        step["description"] = process_step["step_description"];
        if(process_step["inhouse"] != false){
          //console.log(319, ObjectID(this.inhouseUsers[process_step["inhouseUser"]]["_id"]))
          // step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]] ? this.inhouseUsers[process_step["inhouseUser"]]["_id"] : this.inhouseUsers[0]["_id"]
          step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]]["_id"]
          
          console.log(347, step['inhouse'])
        }
        else 
        {
          step['inhouse'] = false;
        }

        if(process_step["checkin"] != false){
          //console.log(319, ObjectID(this.inhouseUsers[process_step["inhouseUser"]]["_id"]))
          // step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]] ? this.inhouseUsers[process_step["inhouseUser"]]["_id"] : this.inhouseUsers[0]["_id"]
          step['checkin'] = this.inhouseUsers[process_step["checkinUser"]]["_id"]
          
          console.log(359, step['checkin'])
        }
        else 
        {
          step['checkin'] = false;
        }

        //step["inhouse"] = process_step["inhouse"];
        step["inhouseUser"] = this.inhouseUsers[process_step["inhouseUser"]];
        step["checkinUser"] = this.inhouseUsers[process_step["checkinUser"]];
        step["skills"] = process_step["skills"];
        step["bounty"] = process_step["bounty"];
        step["files"] = process_step["files"];
        step["pipeline"] = "unclaimed";
        step["status"] = "incomplete";
        step["bStatus"] = false;
        if(stepOrder == 1){
          step["bStatus"] = true;
        }
        steps.push(step);
      }
    }

    var postBody = {
      "brand_name":this.sharedService._variableData["brand_name"],
      "starting_day":"2021-02-28T21:00:00.000Z",
      "frequency":"daily",
      "process":steps
    }

    // This should be enough to post the bounties...
    console.log(177, postBody);
    // this.service.headerButton("bounties", "linksfromselectedkeywords", postBody).subscribe(
    //           (data: any) => {
    //              console.log(122, "Response", data);
    //              this.isLoading = false
                 
    //              alert("Bounties have been created")
    //           }
    //         )

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
    this.service.headerButton("bounties", "linksfromselectedkeywords", postBody).subscribe(
              (data: any) => {
                 console.log(122, "Response", data);
                 this.isLoading = false
                 
                 alert("Bounties have been created")
              }
            )
    
  }

    tableButtonClicked($event){
    console.log(505, $event);
    
    if($event.button == "Files"){
       console.log(391, "Files") 

       console.log($event);

       if($event.bHasCodeGenerator == true){
         this.bHasCodeGenerator = true;
         this.code_generator_url = $event.code_generator_url + "?asset_url=" + encodeURI($event.localFolder)
       }
       //console.log(395, $event);
       this.service.genericAction("refreshlocaldirectory", {
         "local_folder": $event.localPath,
         "box_folder": $event.folderId
       }).subscribe(
              (data: any) => {
                 console.log(401, "Directory Sync Requested");
              }
      )

    }

    if($event.button == "Details"){

      this.sharedService._id = $event.bounty;
      this.sharedService.referringPage = this.flexTable.service.datasourceUrl
      this.sharedService.xbody = this.flexTable.columns
      
      this.sharedService._variableData = $event.bounty;
      //console.log(688, this.sharedService)
      this.router.navigate(['bounty-detail']) 
      return;
    }

    // if($event.button == "Files"){
    //   window.open($event.bountyFolderSharedLink);
    // }
    
    return super.tableButtonClicked($event);  
  }

}
