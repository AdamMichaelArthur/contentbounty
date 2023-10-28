import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { BountyDetailService } from './bounty-detail.service';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service';
import { Location } from '@angular/common';
import * as uuid from 'uuid';
import { Globals } from 'src/app/globals';

import voca from 'voca';
declare var Box:any;

@Component({
  selector: 'app-bounty-detail',
  templateUrl: './bounty-detail.component.html',
  styleUrls: ['./bounty-detail.component.scss']
})
export class BountyDetailComponent extends BaseComponent implements OnInit {
  _id: string = "";

  /* The key inside the document that represents the date */
  _dateKey: string = "";

  /* The value of the _key */
  _dateValue: string = "";

  _variableData: any;

  date: any;

  processes: any;

  all_processes: any;
  team_users: any

  assigned_users = []

  model_array = [];

  inhouseUsers = []

  constructor(public elementRef: ElementRef,
    public service: BaseService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private bountyDetailService: BountyDetailService,
    private _location: Location,
    public globalVars: Globals) {
    super(service, elementRef)
    this._id = this.sharedService._id
    this._dateKey = this.sharedService._dateKey
    this._dateValue = this.sharedService._dateValue
    this._variableData = this.sharedService._variableData
    this.date = this.sharedService.date
    this.processes = this._variableData["process"]

    console.log(58, this.processes);

  }

  ngOnInit(): void {
    this.globalVars.isLoading = true
    this.getProcessSteps()
    this.getTeamUsers()

    console.log(15, this.response)
    
    // console.log("this.all_processes")
    // console.log(this.all_processes)

    // console.log(this.model_array)

    // actions/datasource/bounty/action/files/id/612394a0d45467ab12664754

        console.log(58, this._variableData);
        
        this._variableData.keywords[0] = voca.titleCase(this._variableData.keywords[0])

    this.service.dynamicButton("Bounty", this._variableData["_id"], "Files", null).subscribe(
        (data: any) => {
            var contentExplorer = new Box.ContentExplorer();
                    setTimeout((accessToken, folderId) => {
                      contentExplorer.show(folderId,accessToken,{
                        container:  "#my-box-content-explorer"
                    });
                   },500, data.actions.accessToken, data.actions.folderId)      
                })
  }

  refresh(){

    this.service.dynamicButton("bounty", this._variableData._id, "details").subscribe((data) => {
      this.processes = data["actions"]["bounty"]["process"];
      this.getProcessSteps()
      this.getTeamUsers()    
     // console.log(91, this.processes);
    });
    // this.service.postAction("bounty", "details", {"refDocId":refDocId}).subscribe((data) => {
    //   console.log(346, "Fire Result", data)
    //   this.refresh()
    // })


    // setTimeout((accessToken, folderId) => {
    //   this.getProcessSteps()
    //   this.getTeamUsers()            
    // },1500)   


  }

  backClicked() {
    this._location.back();
  }



  getProcessSteps() {
    var content_type = this._variableData["content_type"]
    this.service.getArray("step", { "content_type": content_type }, true, 1000).subscribe((data) => {
      // data["bChecked"] = false
      this.all_processes = data

      this.service.getAllUsersForAccount("users").subscribe(
        (response: any)=>{

          for(var i=0; i<response.length; i++)
          {
            var obj = {}
            obj["_id"] = response[i]["_id"]
            obj["email"] = response[i]["email"]
            obj["first_name"] = response[i]["first_name"]
            obj["last_name"] = response[i]["last_name"]
            this.inhouseUsers.push(obj)
          }

          this.all_processes.forEach((process) => {
            process.bChecked = false;
            process.inhouse = false
            process.checkin = false
            process.bStatus = false;
            process.assignee = "unclaimed"
            process.green = false;
            process.red = false;
            process.orange = false;
            process.yellow = false;
            process.pink = false;
            process.clear = false;

            for (let x = 0; x < this.processes.length; x++) {

              var bClear = true;

              if (this.processes[x].name == process.step) {

                
                if(this.processes[x].status == "complete"){
                  process.green = true;
                  bClear = false;
                }

                if(this.processes[x].pipeline == "unclaimed"){

                  if(this.processes[x].status == "incomplete"){

                   if(this.processes[x].bStatus == true){
                      process.pink = true;
                    } else {
                      process.red = true;
                    }
                  } 
                }

                if(this.processes[x].status == "incomplete"){
                  if(this.processes[x].pipeline != "unclaimed"){
                    if(this.processes[x].bStatus == false){
                      if(this.processes[x].pipeline.length == 24){
                        process.yellow = true;
                      }    
                    }
                  }
                }
                
                //console.log(114, this.processes[x])

                process["fullStep"] = { ... this.processes[x] }

                //console.log(121, process["fullStep"]);

                this.model_array.push(this.processes[x])
                process.bChecked = true
                if(this.processes[x].inhouse && this.processes[x].inhouse !== false)
                {
                  process.inhouse = true
                }
                else{
                  process.inhouse = false
                }

                if(typeof this.processes[x].friendlyFirstName != 'undefined'){
                  process.assignee = `${this.processes[x].friendlyFirstName} ${this.processes[x].friendlyLastName}`
                }

                if(this.processes[x].bStatus == true){
                  process.bStatus = true;
                }
                
                if(this.processes[x].checkin && this.processes[x].checkin !== false)
                {
                  process.checkin = true
                }
                else{
                  process.checkin = false
                }

                if(this.processes[x].inhouseUser && this.processes[x].inhouseUser !== null)
                {
                  let inhouseUserId = this.processes[x].inhouseUser._id
                  let index = this.inhouseUsers.findIndex(x => x._id === inhouseUserId);
                  process.inhouseUser = index
                }
                if(this.processes[x].checkinUser && this.processes[x].checkinUser !== null)
                {
                  let checkinUserId = this.processes[x].checkinUser._id
                  let index = this.inhouseUsers.findIndex(x => x._id === checkinUserId);
                  process.checkinUser = index
                }

                break;
              }

              // if(bClear){
              //     process.clear = true;
              //   }
            }
            this.globalVars.isLoading = false;
          })
        })

      
    })
  }

  getTeamUsers() {
    this.bountyDetailService.getTeamUsers().subscribe((data) => {
      this.team_users = data["users"]

    })

  }

  removeStepFromExistingBounties(refDocId){
    //console.log(251, refDocId);
    this.bountyDetailService.removeStepFromOneExistingBounty(refDocId).subscribe((data) => {
      //console.log(253, data);
      this.refresh()
    })

  }

  changeProcess(index) {

    console.log(index, this.all_processes[index]);

    if(this.all_processes[index].bChecked == false){
      // We turned off the step.  
      this.removeStepFromExistingBounties(this.all_processes[index].fullStep.refDocId);
      return;
    }

    var updatedStepName = this.all_processes[index]["step"];
    //console.log(269, updatedStepName);

    var steps = [];
    var stepOrder = 0;
    var content_type = "";
    for (var i = 0; i < this.all_processes.length; i++) {
      const process_step = this.all_processes[i];
      //console.log(90, process_step);

      if (process_step.bChecked == true) {
        stepOrder++;
        var step = {}

        content_type = process_step["content_type"]
        step["completion_order"] = stepOrder;
        step["name"] = process_step["step"];
        step["description"] = process_step["step_description"];

        if(process_step["inhouse"] != false){
          if(process_step["inhouseUser"] && process_step["inhouseUser"] != 0)
          {
            step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]]["_id"]
            step['inhouseUser'] = this.inhouseUsers[process_step["inhouseUser"]]
          }
          else
          {
            step['inhouse'] = this.inhouseUsers[0]["_id"]
            step['inhouseUser'] = this.inhouseUsers[0]
          }
          //console.log(319, ObjectID(this.inhouseUsers[process_step["inhouseUser"]]["_id"]))
          // step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]] ? this.inhouseUsers[process_step["inhouseUser"]]["_id"] : this.inhouseUsers[0]["_id"]
          
        }
        else 
        {
          step['inhouse'] = false;
          step['inhouseUser'] = null
        }

        if(process_step["checkin"] != false){
          if(process_step["checkinUser"] &&  process_step["checkinUser"] != 0)
          {
            step['checkin'] = this.inhouseUsers[process_step["checkinUser"]]["_id"]
            step['checkinUser'] = this.inhouseUsers[process_step["checkinUser"]]
          }
          else
          {
            step['checkin'] = this.inhouseUsers[0]["_id"]
            step['checkinUser'] = this.inhouseUsers[0]
          }
          //console.log(319, ObjectID(this.inhouseUsers[process_step["inhouseUser"]]["_id"]))
          // step['inhouse'] = this.inhouseUsers[process_step["inhouseUser"]] ? this.inhouseUsers[process_step["inhouseUser"]]["_id"] : this.inhouseUsers[0]["_id"]
          // step['checkin'] = this.inhouseUsers[0]["_id"]
          // step['checkinUser'] = this.inhouseUsers[0]
          
          //console.log(359, step['checkin'])
        }
        else 
        {
          step['checkin'] = false;
          step['checkinUser'] = null
        }

        step["skills"] = process_step["skills"];
        step["bounty"] = parseInt(process_step["bounty"]);
        // if ()
        step["pipeline"] = process_step["assignee"];
        step["status"] = "incomplete";
        step["bStatus"] = false;
        if (stepOrder == 1) {
          step["bStatus"] = true;
        }
        steps.push(step);
        //
      }
    }

    for(var i = 0; i < this.processes.length; i++){
      for (var y = 0; y < this.all_processes.length; y++){
        for(var t = 0; t < steps.length; t++){
          if(steps[t].completion_order == this.processes[i].completion_order){
            steps[t].refDocId = this.processes[i].refDocId
          }
        }
      }
    }

    for(var t = 0; t < steps.length; t++){
          if(typeof steps[t].refDocId == 'undefined'){
            steps[t].refDocId = uuid.v4();
          }
        }

    this.processes = steps;

    //console.log(364, updatedStepName)

    for(var mstep of steps){
      //console.log(367, mstep);
      if(mstep.name == updatedStepName){
        //console.log(366, "Step to add", mstep)
          this.bountyDetailService.addStepToExistingBounty(this._id, mstep).subscribe((data) => {
            //console.log(371, data);
            this.refresh()
          })
      }
    }

    //console.log(361, steps, steps[index]);



  }

  backToCalender() {

  }

  claim(){
      this.service.dynamicButton("bounty", this._id, "Claim", null).subscribe((data) => {
    })

  }

  complete(){

  }

  fireContractor(refDocId){

    alert("This will fire this contractor and release the bounty for someone new");

    // postAction(datasource, action: string, body = {})

    this.service.postAction("bounty", "fireContractor", {"refDocId":refDocId}).subscribe((data) => {
      console.log(346, "Fire Result", data)
      this.refresh()
    })


    return false;
  }

  forceComplete(refDocId){

    alert("This will mark this step as complete");

    // postAction(datasource, action: string, body = {})

    this.service.postAction("bounty", "forcecomplete", {"refDocId":refDocId}).subscribe((data) => {
      console.log(346, "Force Complete Result", data);
          this.refresh()
    })


    return false;
  }

  forceCompleteEverything(){

    alert("This will mark the entire Bounty as complete");

    // postAction(datasource, action: string, body = {})

    this.service.postAction("bounty", "forcecompleteeverything", {"bounty_id": this._id }).subscribe((data) => {
      console.log(346, "Force Complete Result", data)
    })

    this.refresh()
    return false;
  }

  displayFiles: Boolean = false;

  files($event){
  
    $event.preventDefault();
    this.displayFiles = !this.displayFiles
  
  }

}