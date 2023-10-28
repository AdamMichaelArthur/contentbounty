import { Component, ElementRef, OnInit, Output, EventEmitter, ViewChild, ViewChildren, AfterViewInit, AfterContentInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service';
import { SniperEmailsComponent } from '../sniper-emails/sniper-emails.component'
import { EmailReceivedActionsComponent } from '../email-received-actions/email-received-actions.component'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Globals } from 'src/app/globals';


@Component({
  selector: 'app-email-received',
  templateUrl: './email-received.component.html',
  styleUrls: ['./email-received.component.css']
})

export class EmailReceivedComponent extends SniperEmailsComponent implements OnInit {

  @ViewChild(EmailReceivedComponent, { static: true }) emailActions!: EmailReceivedActionsComponent;

  constructor(public service: BaseService, public elementRef: ElementRef, public globalVars: Globals) {
    super(service, elementRef, globalVars) 
  }

  emailReceivedComponent = true

  buttons = [
    {
      "buttonValue": "Unrelated To Links",
      "buttonType":"normal"
    },  // The email is unrelated to link building -- permanently skip
    {"buttonValue": "Remove From List", "buttonType": "normal" },    // Puts this email on a do not email list
    {"buttonValue": "Create Bounty", "buttonType": "normal"},       // Pulls up a create bounty form so we can create a bounty
    {"buttonValue": "Skip", "buttonType": "normal"},                // Makes an edit in the database and skips this email
    {"buttonValue": "Pay To Play", "buttonType": "normal"},         // When this is clicked, a form will popup asking for more information.  That info will be saved to the database
    {"buttonValue": "Affiliate Site", "buttonType": "toggle"},      // I want this to be a 'depressed' button
    {"buttonValue": "e-Commerce Site", "buttonType": "toggle"},     // I want this to be a 'depressed' button
    {"buttonValue": "Content Site", "buttonType": "toggle"},        // I want this to be a 'depressed' button
    {"buttonValue": "Potential CB Customer", "buttonType": "toggle"}, // I want this to be a 'depressed' button
  ]

  sendEmailsData = {
      to: ["adamarthursandiego@gmail.com"],
      from: ["adamarthursandiego@gmail.com"],
      subject: ["subject"],
      body: ["body"]
  }

  aggregateStr = `[{
    '$match': {
      'reviewed': false,
      'response_count': 0,
      'skip': { $ne: true },
      'paytoplay': { $ne: true },
      'from': { $ne: 'admin@inbrain.space' },
      'to': { $ne: "haro.inbound@gmail.com"}
    }
  }]`

  // aggregateStr = `[{
  //   '$match': {
  //     'reviewed': false,
  //     'response_count': 0
  //   }
  // }]` 
  

  datasource = "messages"

  ngOnInit(): void {

    super.ngOnInit()

  }

  // selectChangedInChild(event){
  //   console.log("testagain")
  //   // if(event === 'Unrelated To Links'){
  //   //   alert("Unrelated To Links button clicked")
  //   // }
  //   // if(event === 'Remove From List'){
  //   //   alert("Remove From List button clicked")
  //   // }
  //   // if(event === 'Create Bounty'){
  //   //   alert("Create Bounty button clicked")
  //   // }

  //   alert(event+" option selected")
  // }

// master branch code:

  buttonClickedInChild(event){
    console.log(97, "email-received")

    if(event == "Unrelated To Links")
    {
      this.unrelatedToLinks()
    }

    if(event == "Skip")
    {
      this.skip()
    }

    if(event == "Pay To Play")
    {
      this.paytoplay()
    }

    // if(event === 'Unrelated To Links'){
    //   alert("Unrelated To Links button clicked")
    // }
    // if(event === 'Remove From List'){
    //   alert("Remove From List button clicked")
    // }
    // if(event === 'Create Bounty'){
    //   alert("Create Bounty button clicked")
    // }

    // alert(event+" button clicked")
  }

  paytoplay(){
    this.editDataById("paytoplay", true)
  }

  unrelatedToLinks(){
    this.editDataById('links', 'unrelated')
  }

  skip(){
    // Display a form here so we can input this data for later use
    this.editDataById('skip', true)
  }

  editDataById(key, value){
    var currentEmail = this.emails[0]

    console.log(126, currentEmail, key, value)

    // this.service.editDataById(currentEmail._id, { key: key, value: value }).subscribe(
    //   (data: any) => {
    //     console.log(136, 'updated')
    //     this.loadNextEmail();
    //   }
    // )    
  }

  // code from Noor Jahan's Backup:

  selectChangedInChild(event){
    console.log("testagain")
    // if(event === 'Unrelated To Links'){
    //   alert("Unrelated To Links button clicked")
    // }
    // if(event === 'Remove From List'){
    //   alert("Remove From List button clicked")
    // }
    // if(event === 'Create Bounty'){
    //   alert("Create Bounty button clicked")
    // }

    // alert(event+" option selected")
  }

  // buttonClickedInChild(event){
  //   console.log("testagain")
  //   // if(event === 'Unrelated To Links'){
  //   //   alert("Unrelated To Links button clicked")
  //   // }
  //   // if(event === 'Remove From List'){
  //   //   alert("Remove From List button clicked")
  //   // }
  //   // if(event === 'Create Bounty'){
  //   //   alert("Create Bounty button clicked")
  //   // }

  //   alert(event+" button clicked")
  // }

}
