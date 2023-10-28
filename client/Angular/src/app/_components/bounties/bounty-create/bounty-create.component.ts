// branch
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseService } from '../../base/base.service';

interface Frequency {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-bounty-create',
  templateUrl: './bounty-create.component.html',
  styleUrls: ['./bounty-create.component.scss']
})
export class BountyCreateComponent implements OnInit {

  constructor(
    public service: BaseService, 
  ) { }

  @Input() displayTableButtonArea: boolean = true;
  @Input() content_type;
  @Input() currentBounty: any;
  @Input() bShowDateTimePicker: boolean = false;
  @Input() bShowFrequencyPicker: boolean = false;
  @Input() bShowKeywords: boolean = false;
  @Output() hideTableButtonArea = new EventEmitter<boolean>();
  @Output() passBountyTemplate = new EventEmitter<any>();

  data = []
  selected: any = ''
  inhouseUsers = []
  sections: any;
  total_bounty: number = 0;
  currentBrand;
  myDate: any
  add_keywords: string = "";

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


  ngOnInit(): void {
    console.log(28, this.content_type)

    // For some reason this line is causing a lot of breaking changes so I temporarily commented it out.
    // What it does is ensure that we get our steps returned to us in the proper completion_order
    var sort = { "display_pos": 1 }
    // this.service.getArrayWithSort("step", {"content_type":this.content_type}, true, 100,sort, "created,createdAt,created_by,modified,modifiedAt,modified_by,owner,_id,bounty,checkInUser,checkin,content_type,display_pos,files,inhouse,inhouseUser,process,selected,skills,stage,step,step_description,suggested_bounty").subscribe((data: any) => {   

    this.service.getArray("step", {"content_type":this.content_type}, true, 100).subscribe((data: any) => {   
          this.data = [];
          var sections = []

          console.log(33, this.data);
          
          this.service.getAllUsersForAccount("users").subscribe(
            (response: any)=>{
              
              console.log(35, response);
              
              for(var i=0; i<response.length; i++)
              {

                var obj = {}
                obj["_id"] = response[i]["_id"]
                obj["email"] = response[i]["email"]
                obj["first_name"] = response[i]["first_name"]
                obj["last_name"] = response[i]["last_name"]
                this.inhouseUsers.push(obj)
              }
              console.log(130, this.inhouseUsers)
            })

          for(var i = 0; i < data.length; i++){
                    console.log(118, data[i])
                    var processRow = {}
                    processRow["process"] = false;
                    processRow["inhouse"] = false;
                    processRow["inhouseUser"] = [];
                    processRow["checkin"] = false;
                    processRow["checkInUser"] = [];
                    processRow = Object.assign(processRow, data[i])
                    this.data.push(processRow);
                    sections.push(data[i].stage)
          }
          this.sections = new Set(sections);
          console.log(125, this.sections);
          console.log(126, this.data);
        }) 
  }

  disapparePopup(){
    this.displayTableButtonArea = false
    this.hideTableButtonArea.emit(this.displayTableButtonArea);
    console.log(100)
    // this.unusedKeywords = !this.unusedKeywords
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

  updateBountyTotal($event, process_step){
    var newValue = 0;
    if($event?.length == 0)
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
    this.total_bounty = 0;

  }

  //Save Guidelines
  additional_instruction:string = "";

  bountyTemplate: Array<any> = [];

  addGuide(){
    this.reset();
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
        step["files"] = process_step["files"];
        step["bounty"] = process_step["bounty"];
        step["pipeline"] = "unclaimed";
        step["status"] = "incomplete";
        step["bStatus"] = false;
        if(stepOrder == 1){
          step["bStatus"] = true;
        }
        steps.push(step);
        // console.log(330, JSON.stringify(step["inhouseUser"].first_name))
      }
    }

    console.log(234, this.currentBounty);
    
    // this.currentBounty.brand_name = this.currentBrand;
    const addProcess = {
      content_type: content_type,
      dropboxLink: this.dropboxLink,
      promptLists: this.promptLists,
      additional_instruction: this.additional_instruction,
      process:steps,
      bounty:this.currentBounty,
      release_for_bounty: this.myDate
    }

    if(this.add_keywords != ""){
      addProcess["keywprds"] = this.add_keywords
    }

    this.bountyTemplate.push(addProcess);
    // this.hideBounty()
    this.disapparePopup()
    this.passBountyTemplate.emit(this.bountyTemplate);
    
  }

  // disapparePopup(){
  //   this.displayTableButtonArea = false
  //   this.hideTableButtonArea.emit(this.displayTableButtonArea);
  //   // this.unusedKeywords = !this.unusedKeywords
  // }

  //Save Guidelines

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
  keywordsAr: Array<any> = [];

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
}
