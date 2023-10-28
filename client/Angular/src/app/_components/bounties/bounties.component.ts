import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router, NavigationExtras } from '@angular/router'

interface Frequency {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-bounties',
  templateUrl: './bounties.component.html',
  styleUrls: ['./bounties.component.css']
})

export class BountiesComponent extends BaseComponent implements OnInit {

    singleBounty: Boolean = false;

    frequencies: Frequency[] = [
    {value: 'once', viewValue: 'One Time'},
    {value: '2xDay', viewValue: 'Two Times Per Day'},
    {value: '3xDay', viewValue: 'Three Times Per Day'},
    {value: '4xDay', viewValue: 'Four Times Per Day'},    
    {value: 'daily', viewValue: 'Daily'},
    {value: '2xWeek', viewValue: 'Every Other Day'},
    {value: '3xWeek', viewValue: 'Every Third Day'},
    {value: '4xWeek', viewValue: 'Every Fourth Day'},
    {value: '5xWeek', viewValue: 'Every Fifth Day'},
    {value: '6xWeek', viewValue: 'Every Sixth Day'},
    {value: '1xWeek', viewValue: 'Once Per Week'},
    {value: '2xMonth', viewValue: 'Every Other Week'},
    {value: '1xMonth', viewValue: 'Once Per Month'}
  ];
  
  viewMode = 'process';
  data:any = [];
  sections: any;

  filters = [
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
      "filter": false,
      "label": "Brand",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",
      "all":false
    }
  ]

  constructor(
    public service: BaseService, 
    public elementRef: ElementRef, 
    public sharedService: SharedService, 
    public router: Router) {
    super(service, elementRef) 
  }

  monthly_budget: any = "0";

  hideTableButtonArea(){
    
    this.displayTableButtonArea = false
    console.log("Override default behavior");

  }

  ngOnInit(){
    super.ngOnInit();
    this.data = [
      {
        process: true,
        process_lable:"Step 1",
        process_desc:"Simple Description...",
        inhouse:true,
        checkin:false
      },
      {
        process: false,
        process_lable:"Step 2",
        process_desc:"Simple Description...",
        inhouse:false,
        checkin:true
      },
      {
        process: false,
        process_lable:"Step 3",
        process_desc:"Simple Description...",
        inhouse:true,
        checkin:false
      }
    ]
  }

  brands = [];
  ngAfterViewInit() {
    this.service.getDistinctArrayWithIds("brands", "brand_name", false).subscribe((data: any) => {
         this.brands = data;
         console.log(92, this.brands);
    })
  }

  isApproved:boolean = false;
  inhouseUsers = []
  content_type: any;
  tableButtonClicked($event){
    
    this.displayTableButtonArea = false;
    this.response = $event;
    console.log(62, this.response);
    // The response should include a process name to get
    if($event.button == "Add"){
      if(this.currentBrand == ""){
        alert("Please Select A Brand First");
        return;
      }

      if($event.bounty.frequency == "Select Frequency"){
        alert("Please Select A Frequency First...");
        return;
      }

      if($event.bounty.starting_day == "Select Day"){
        alert("Please Select the Day you want to start");
        return;
      }

      // get content Type
      this.content_type = $event.content_type;
      var sections = []
      this.inhouseUsers = []
      this.monthly_budget = $event.message;

      console.log(132, $event.bounty)

      this.currentBounty = $event.bounty;
      this.currentBounty.brand_name = ""

      this.displayTableButtonArea = true;



      // this.router.navigate(['/create-bounty', {content_type: content_type}])
      // this.router.navigate(['/create-bounty'], { queryParams: { content_type: content_type, monthly_budget: this.monthly_budget, currentBounty: this.currentBounty } });
      
      // this.service.getArray("step", {"content_type":this.content_type}, true, 100).subscribe((data: any) => {   
      //     this.data = [];

      //     this.service.getAllUsersForAccount("users").subscribe(
      //       (response: any)=>{
      //         console.log(118, response)
      //         for(var i=0; i<response.length; i++)
      //         {
      //           var obj = {}
      //           obj["_id"] = response[i]["_id"]
      //           obj["email"] = response[i]["email"]
      //           obj["first_name"] = response[i]["first_name"]
      //           obj["last_name"] = response[i]["last_name"]
      //           this.inhouseUsers.push(obj)
      //         }
      //         console.log(130, this.inhouseUsers)
      //       })

      //     for(var i = 0; i < data.length; i++){
      //               var processRow = {}
      //               processRow["process"] = false;
      //               processRow["inhouse"] = false;
      //               processRow["inhouseUser"] = [];
      //               processRow["checkin"] = false;
      //               processRow["checkInUser"] = [];
      //               processRow = Object.assign(processRow, data[i])
      //               this.data.push(processRow);
      //               sections.push(data[i].stage)
      //     }
      //     this.sections = new Set(sections);
      //     console.log(125, this.sections);
      //     console.log(126, this.data);
      //   }) 

      // this.add($event)
      // super.tableButtonClicked($event);
      return;
    }
    super.tableButtonClicked($event);
  }

  flextableHeaderButtonClicked(event){
    
    if(event == "Start Over"){
      this.service.dynamicButton("process", "StartOver", "startover").subscribe(
              (data: any) => {
                 this.monthly_budget = "0";
              }
            )
      return;
    }

    if(event == "Single Bounty"){

      if(this.currentBrand == ""){
        alert("Please Select A Brand First");
        return;
      }

      var filter = {
        "brand_name":this.currentBrand,
        "bKeywordDeployed": {$ne: true }
      }
  
      if(this.currentContentType == ""){
        alert("Please Select A Content Type First");
        return;
      }

      this.singleBounty = true;
      this.processPopup = true;
      this.inhouseUsers = []
      var content_type = this.currentContentType;
      return false;
    }


    if(event == "Unused Keywords"){
      // We want to create bounties based on our unused keywords
      // Display a 

      if(this.currentBrand == ""){
        alert("Please Select A Brand First");
        return;
      }

      var filter = {
        "brand_name":this.currentBrand,
        "bKeywordDeployed": {$ne: true }
      }
  
      if(this.currentContentType == ""){
        alert("Please Select A Content Type First");
        return;
      }

      this.unusedKeywords = true;
      this.processPopup = true;
      this.inhouseUsers = []
      var content_type = this.currentContentType;

      // var sections = []

      // this.service.getArray("step", {"content_type":content_type}, true, 100).subscribe((data: any) => {   
      //     this.data = [];
      //     this.service.getAllUsersForAccount("users").subscribe(
      //       (response: any)=>{
      //         console.log(118, response)
      //         for(var i=0; i<response.length; i++)
      //         {
      //           var obj = {}
      //           obj["_id"] = response[i]["_id"]
      //           obj["email"] = response[i]["email"]
      //           obj["first_name"] = response[i]["first_name"]
      //           obj["last_name"] = response[i]["last_name"]
      //           this.inhouseUsers.push(obj)
      //         }

      //       })
      //     for(var i = 0; i < data.length; i++){
      //               var processRow = {}
      //               processRow["process"] = false;
      //               processRow["inhouse"] = false;
      //               processRow["inhouseUser"] = [];
      //               processRow["checkin"] = false;
      //               processRow["checkInUser"] = [];
      //               processRow = Object.assign(processRow, data[i])
      //               this.data.push(processRow);
      //               sections.push(data[i].stage)
      //     }
      //     this.sections = new Set(sections);
      //   })

      return;
    }

    if(event == "Approve All"){
      if(this.bountyTemplate.length == 0){
        alert("Please Add A Bounty Before Trying to Approve Them");
        return;
      }

      this.isApproved = true;

      this.bountyTemplate[0]["bounty"]["brand_id"] = this.currentBrandId;

      // Parse and create the bounties
      this.service.headerButton("bounty", "createbounties", this.bountyTemplate).subscribe(
              (data: any) => {
                 var brand_id = 0;
                 //console.log(122, "Response", data);
                 console.log(152, this.brands);
                 for(var i = 0; i < this.brands.length; i++){
                   if(this.brands[i].brand_name == this.currentBrand){
                     brand_id = this.brands[i]["_id"]
                   }
                 }
                 let navigationExtras: NavigationExtras = {
                      queryParams: {
                        "batch":data.actions.batch,
                         "brand_name":this.currentBrand,
                         "brand_id":brand_id
                      }
                  };
                  console.log(235, navigationExtras);

                 var info = {
                   "batch":data.actions.batch,
                   "brand_name":this.currentBrand,
                   "brand_id":brand_id
                 }
                 this.isApproved = false;
                 this.router.navigate(["/addkeyword"], navigationExtras);
              }
            )
      return;
    }

    super.flextableHeaderButtonClicked(event);

  }

  currentContentType: String = "";


  headerDropdownChanged($event){
    console.log(146, "A header button changed", $event, $event.value);
    
    if($event.label == "Content Type"){
      this.currentContentType = $event.value;
      return;
    }

    this.currentBrand = $event.value;

    console.log(311, $event.value);

    if(this.currentBrand == ""){
        alert("Please Select A Brand First");
        return;
      }

    for(var i = 0; i < this.brands.length; i++){
        if(this.brands[i].brand_name == this.currentBrand){
            this.currentBrandId = this.brands[i]["_id"]
    }
    }

  }

  currentBrand: any = "";
  currentBrandId: any = "";
  currentBounty: any = {}

  add($event){

    console.log(32, $event);
    this.monthly_budget = $event.message;
    this.currentBounty = $event.bounty;
  }

  // Editorial Guidelines
  dropboxLinkInput: any
  dropboxLink: any = [];
  addDropBox(link: string) {
    this.dropboxLink.push(link);
    this.dropboxLinkInput = null
  }
  deleteDropboxLink(link:string){
    const index: number = this.dropboxLink.indexOf(link);
    if (index !== -1) {
      this.dropboxLink.splice(index, 1)
    }
  }
  // Editorial Guidelines

  // Prompt Bucket
  promptLists: any = [];
  volume = 0;
  clicks = 0;

  deletePrompt(prompt: string) {
    const index: number = this.promptLists.indexOf(prompt);
    if (index !== -1) {
      for(var i = 0; i < this.keywordsAr.length; i++){

        if(this.keywordsAr[i]["Keyword"] == this.promptLists[index]){
          console.log(147, this.keywordsAr[i], this.promptLists[index])

          if(this.keywordsAr[i]["Clicks"] != 'undefined'){
            if(Number.isNaN(parseInt(this.keywordsAr[i]["Clicks"])) == false){
              this.clicks -= parseInt(this.keywordsAr[i]["Clicks"]);
            } 
          }

          if(this.keywordsAr[i]["Volume"] != 'undefined'){
            if(Number.isNaN(parseInt(this.keywordsAr[i]["Volume"])) == false){
              this.volume -= parseInt(this.keywordsAr[i]["Volume"])
            } 
          }

        }
      }
      this.promptLists.splice(index, 1)
    }
  }
  // Prompt Bucket end

  // initiating inhouse user

  onCheckinHouse(event, i){
    if(event.target.checked){
      this.data[i].inhouseUser = 0
      console.log(304, this.data[i].inhouseUser, this.inhouseUsers[0])
    }
  }

  // initiating inhouse user end

  // initiating checkin user

  onCheckcheckIn(event, i){
    if(event.target.checked){
      this.data[i].checkinUser = 0
      console.log(315, this.data[i].checkinUser, this.inhouseUsers[0])
    }
  }

  // initiating checkin user end

  //Save Guidelines
  additional_instruction:string = "";

  bountyTemplate: Array<any> = [];

  addGuide($event){
    this.reset();

    console.log(378, this.currentBounty);


    console.log(381, 'Add Guide Called', $event)


    console.log(430, this.currentBounty)
    this.currentBounty.brand_name = this.currentBrand;


    const addProcess = $event
    var brand_id = 0

    console.log(152, this.brands);
    for(var i = 0; i < this.brands.length; i++){
      if(this.brands[i].brand_name == this.currentBrand){
        brand_id = this.brands[i]["_id"]
      }
    }
    
    console.log(448, addProcess)
    addProcess[0]["bounty"] = this.currentBounty
    addProcess[0]["bounty"]["brand_id"] = brand_id
    console.log(450, addProcess[0]["bounty"]["brand_name"])
    console.log(450, addProcess[0]["bounty"]["brand_id"])

    this.bountyTemplate.push(addProcess[0]);
    this.hideBounty()
  }

  //Save Guidelines

    // We are receiving a drop from the flextable
    keywordsAr: Array<any> = [];
  drop(event: CdkDragDrop<string[]>) {
      //this.sharedService.drop(event);
      var dropData = event.previousContainer.data[event.previousIndex];
      
      console.log(167, event.currentIndex);

      console.log(168, event);

      this.promptLists.push(event.previousContainer.data[event.previousIndex]["Keyword"]);
      this.keywordsAr.push(dropData);

      if(dropData["Clicks"] != 'undefined'){
        if(Number.isNaN(parseInt(dropData["Clicks"])) == false){
          this.clicks += parseInt(dropData["Clicks"]);
        } 
      }
      if(dropData["Volume"] != 'undefined'){
        if(Number.isNaN(parseInt(dropData["Volume"])) == false){
          this.volume += parseInt(dropData["Volume"])
        } 
      }
  }

  total_bounty: number = 0;

  updateBountyTotal($event, process_step){
    var newValue = 0;
    if($event.length == 0)
      newValue = 0;
    else
      newValue = parseInt($event);
  
    var lastArPos = process_step["previous_values"].length-1;
    
    this.total_bounty -= process_step["previous_values"][lastArPos]
    process_step["previous_values"].push(newValue)
    //process_step.previous_value = newValue;

    this.total_bounty += newValue;
    //var newValue = parseInt($event.srcElement.value);
    //this.total_bounty -= process_step.bounty;
    //this.total_bounty += newValue;
    //process_step.bounty = newValue
  }

  reset(){
    console.log(471, "reset")
    this.total_bounty = 0;
    this.displayTableButtonArea = false;
  }

  stepChecked(process_step){
    process_step["previous_values"] = [];
    process_step["previous_values"].push(process_step.bounty)
    if(process_step.process){
      process_step.bounty = process_step.suggested_bounty;
      this.total_bounty += process_step.bounty;
    }
    else {
      this.total_bounty -= process_step.bounty;
      process_step.bounty = 0;
    }
    process_step["previous_values"].push(process_step.bounty)
  }

  getUnusedKeywords(){

  }

  unusedKeywords: boolean = false
  processPopup: boolean = false;

  selected: any = ''
  myDate: any
  isLoading:boolean = false
  
  test(i){

    this.data[i].inhouseUser[0] = this.inhouseUsers[0]
    console.log(446, "test", this.data[i].inhouseUser, this.inhouseUsers[0])  
  }

  initUsers(){
    //var proc = this.data[i]
    console.log(451, this.data)
  }

  steps = []

  useKeywordsProcess(process){
    this.processPopup = false;
    this.steps = process;
    console.log(298, process)
  }

  hideKeywordsProcess(){
    //this.unusedKeywords = false;
    this.processPopup = false;
  }

  bShowKeywords = false;
  createSingleUseBounty(process){
    this.processPopup = false;
    this.steps = process;   
    this.bShowKeywords = true;
    this.displayTableButtonArea = false;
    this.singleBounty = false;
    var content_type = this.currentContentType;

    // singlebounty
    alert("Create Single Use Bounty Starting Today");

    var postBody = {
      "brand_name":this.currentBrand,
      "brand_id":this.currentBrandId,
      "content_type":content_type,
      "process":this.steps[0].process
    }

    

    console.log(632, postBody);

    // // This should be enough to post the bounties...
    this.service.headerButton("bounties", "singlebounty", postBody).subscribe(
              (data: any) => {
                 console.log(122, "Response", data);
                 
              if (confirm("Would you like to claim the first step in this bounty for yourself?")) {
                  console.log(618, "Claimed", data);

                  // var bounty = {
                  //   "refDocId": data.process[0]["refDocId"],
                  //   ... data
                  // }

                  var bounty = {
                      "brand_name": data["brand_name"],
                      "brand_id": this.currentBrandId,
                      "content_type": data["content_type"],
                      "name": data["process"][0]["name"],
                      "bounty": data["process"][0]["name"],
                      "description": data["process"][0]["name"],
                      "completion_order": data["process"][0]["completion_order"],
                      "refDocId": data["process"][0]["refDocId"]
                  }

                this.service.dynamicButton("bounty", data._id, "Claim", bounty).subscribe((data) => {
                    alert("Bounty is claimed");
                  })
                } else {
                  console.log(618, "Nope");
                  //
                }
                 // setTimeout( () => {
                 //   this.isLoading = false
                 //   //this.router.navigate(["/calendar"]);
                 //   alert("Bounty Created");
                 // }, 10000)
                 //
              }
            )

  }

  displayFiles = false;

  createBountiesByUnusedKeywords(){
    this.isLoading = true;
    this.unusedKeywords = false;
    var steps = this.steps;
    var stepOrder = 0;
    var content_type = this.currentContentType;

    // for(var i = 0; i < this.data.length; i++){
    //   const process_step = this.data[i];

    //   if(process_step.process == true){
    //     stepOrder++;
    //     var step = {}
    //     content_type= process_step["content_type"]
    //     step["completion_order"] = stepOrder;
    //     step["name"] = process_step["step"];
    //     step["description"] = process_step["step_description"];
    //     if(process_step["inhouse"] != false){
    //       //console.log(319, ObjectID(this.inhouseUsers[process_step["inhouseUser"]]["_id"]))
    //       // step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]] ? this.inhouseUsers[process_step["inhouseUser"]]["_id"] : this.inhouseUsers[0]["_id"]
    //       step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]]["_id"]
          
    //       console.log(347, step['inhouse'])
    //     }
    //     else 
    //     {
    //       step['inhouse'] = false;
    //     }

    //     if(process_step["checkin"] != false){
    //       //console.log(319, ObjectID(this.inhouseUsers[process_step["inhouseUser"]]["_id"]))
    //       // step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]] ? this.inhouseUsers[process_step["inhouseUser"]]["_id"] : this.inhouseUsers[0]["_id"]
    //       step['checkin'] = this.inhouseUsers[process_step["checkinUser"]]["_id"]
          
    //       console.log(359, step['checkin'])
    //     }
    //     else 
    //     {
    //       step['checkin'] = false;
    //     }

    //     //step["inhouse"] = process_step["inhouse"];
    //     step["inhouseUser"] = this.inhouseUsers[process_step["inhouseUser"]];
    //     step["checkinUser"] = this.inhouseUsers[process_step["checkinUser"]];
    //     step["skills"] = process_step["skills"];
    //     step["bounty"] = process_step["bounty"];
    //     step["files"] = process_step["files"];
    //     step["pipeline"] = "unclaimed";
    //     step["status"] = "incomplete";
    //     step["bStatus"] = false;
    //     if(stepOrder == 1){
    //       step["bStatus"] = true;
    //     }
    //     steps.push(step);
    //   }

    // }

    var postBody = {
      "brand_name":this.currentBrand,
      "starting_day":this.myDate,
      "frequency":this.selected,
      "content_type":content_type,
      "process":this.steps[0].process
    }

    console.log(632, postBody);

    // // This should be enough to post the bounties...
    this.service.headerButton("bounties", "bountiesfromkeywords", postBody).subscribe(
              (data: any) => {
                 console.log(122, "Response", data);
                 
                 
                 setTimeout( () => {
                   this.isLoading = false
                   this.router.navigate(["/calendar"]);
                 }, 10000)
                 //
              }
            )

  }

  disapparePopup(){
    this.displayTableButtonArea = false
    // this.unusedKeywords = !this.unusedKeywords
  }
  disapparePopup2(){
    this.unusedKeywords = false
  }

}
