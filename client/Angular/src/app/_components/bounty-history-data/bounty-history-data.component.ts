
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {MatIconModule} from '@angular/material/icon';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bounty-history-data',
  templateUrl: './bounty-history-data.component.html',
  styleUrls: ['./bounty-history-data.component.css']
})
export class BountyHistoryDataComponent implements OnInit {
  public baseUrl = environment.apiBase;
  public unclaimedBounties=0;
  public completedBounties=0
  unreleasedBounties=0;
  checkinWaitingBouties=0;
  inHouseWaitingBounties=0;
  inProgressBounties=0;
  showUnclaimedBounties=true;
  showCompletedBounties=true;
  showUnreleasedBounties=true;
  dataList=[];
  allSummary=[];


  constructor(private http:HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.dataFromDb()

  }

  dataFromDb(){

    this.http.post(this.baseUrl+"/"+"cards/getUnclaimedBountiesWithSummary",{}).subscribe((data:any)=>{
      this.unclaimedBounties=data?.actions?.result?.bounties[0]?.bounty;
      let summary=data?.actions?.result.summary.slice(0,5)
      this.dataList.push({"hData":this.unclaimedBounties,"label":"unclaimed Bounties"})
      this.allSummary.push({"bounty":this.unclaimedBounties,"summary":summary,'label':"Unclaimed Bounties",method:"getUnclaimedBountiesWithSummary"})
    },err=>{
      console.log(err.message);
    })

    this.http.post(this.baseUrl+"/"+"cards/getCompletedBounties",{}).subscribe((data:any)=>{
      this.completedBounties=data?.actions?.result?.bounties[0]?.bounty;
      let summary=data?.actions.result.summary.slice(0,5);
      let summaryText = data?.actions.result.summaryText.slice(0,5);
      this.allSummary.push({"bounty":this.completedBounties,"summary":summary,"summaryText":summaryText,'label':"Completed Bounties",method:"getCompletedBounties"})
    },err=>{
      console.log(err.message );
    }) 

    this.http.post(this.baseUrl+"/"+"cards/getInProcessBountiesWithSummary",{}).subscribe((data:any)=>{
      this.inProgressBounties=data?.actions?.result?.bounties[0]?.bounty
      this.dataList.push({"hData":this.inProgressBounties,"label":"In Progress Bounties"})
      let summary=data?.actions.result.summary.slice(0,5);
      this.allSummary.push({"bounty":this.inProgressBounties,"summary":summary,'label':"In Progress Bounties",method:"getInProcessBountiesWithSummary"})
    },err=>{
      console.log(err.message);
    })


    this.http.post(this.baseUrl+"/"+"cards/getUnreleasedBountiesWithSummary",{}).subscribe((data:any)=>{
      this.unreleasedBounties=data?.actions?.result?.bounties[0]?.pipeline
      let summaryText = data?.actions.result.summaryText.slice(0,5);
      this.dataList.push({"hData":this.unreleasedBounties,"label":"Unreleased Bounties"})
      let summary=data?.actions.result.summary.slice(0,5);
      this.allSummary.push({"bounty":this.unreleasedBounties,"summary":summary,"summaryText":summaryText,'label':"Unreleased Bounties","method":"getUnreleasedBountiesWithSummary"})
    },err=>{
      console.log(err.message);
    })
     
    this.http.post(this.baseUrl+"/"+"cards/bounty_step_is_waiting_on_approval_in_checkinWithSummary",{}).subscribe((data:any)=>{
      this.checkinWaitingBouties=data?.actions?.result?.bounties[0]?.bounty
      this.dataList.push({"hData":this.checkinWaitingBouties,"label":"Check In - needs inhouse attention"})
      let summary=data?.actions.result.summary?.slice(0,5);
      this.allSummary.push({"bounty":this.checkinWaitingBouties,"summary":summary,'label':"Checkin Bounties",method:"bounty_step_is_waiting_on_approval_in_checkinWithSummary"})
    },err=>{
      console.log(err.message);
    })

    this.http.post(this.baseUrl+"/"+"cards/bounty_step_is_waiting_on_being_completed_in_houseWithSummary",{}).subscribe((data:any)=>{
      this.inHouseWaitingBounties=data?.actions?.result?.bounties[0]?.bounty
      this.dataList.push({"hData":this.inHouseWaitingBounties,"label":"In House"})
      let summary=data?.actions.result.summary.slice(0,5);
      this.allSummary.push({"bounty":this.inHouseWaitingBounties,"summary":summary,'label':"In House Bounties",method:"bounty_step_is_waiting_on_being_completed_in_houseWithSummary"})
    },err=>{
      console.log(err.message);
    })
console.log(this.allSummary)
  }

 
  showdetails=false;
  method="";
  onClick($event:any,method){
    //alert($event.message)
    this.showdetails=$event.message;
    this.method=method
  }

onCloseClick($event:any){
  this.showdetails=!$event.message
}
}
