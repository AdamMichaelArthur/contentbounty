
import { Component, Input, Output, OnInit, EventEmitter, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { EmailSendService } from './email-send.service';
import { BaseComponent } from '../base/base.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BaseService } from '../base/base.service';
import { Globals } from 'src/app/globals';
import { timeout } from "rxjs/operators";
import { onErrorResumeNext } from 'rxjs';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.css'],
})

export class EmailSendComponent extends BaseComponent implements OnInit {

  @Input() sendEmailsData;

  @Input() emailSentSuccessfully = new EventEmitter<boolean>();

  @Input() emailReceived = false;

  @Output() loadNextEmail = new EventEmitter<any>();

  buttom_Config_text = {
    text: 'Send Email Now'
  }
  
  dataModel = null;
  // mergeFields: Array<any> = []=[];

  emailSendErrorMessage = ''

  templates = null;

  constructor(public service: BaseService, public elementRef: ElementRef, private formBuilder: UntypedFormBuilder, public globalVars: Globals) {
    super(service, elementRef) 
  }

  // buttom_Config_text = {
  //   text: 'Send Email Now'
  // }

  sendEmailForm: UntypedFormGroup;
  submitted = false
  // sendEmailErrorMessage = false
  // isLoading = false
  // websiteUrlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  // targetkeyword
  // target_link
  // blog_page
  // weight
  // target_keyword
  // dataModel: string = ''

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

  buttonClickedInChild(event){
    console.log("testagain")

    switch(event){
      case "Unrelated To Links":
        this.unrelatedToLinks()
        break;
      case "Remove From List":
        this.removefromlist();
        break;
      case "Create Bounty":
        this.createBounty()
        break;
      case "Skip":
        this.skip();
        break;
      case "Pay To Play":
        console.log("test")
        this.paytoplay();
        break;
      case "Affiliate Site":
        this.affiliatesite();
        break;
      case "e-Commerce Site":
        this.ecommercesite()
        break;
      case "Content Site":
        this.contentsite()
        break;
      case "Potential CB Customer":
        this.potentialcbcustomer()
        break;
      default:
        // alert(event+" button clicked")
        break;
    }

  }

  selectChangedInChild(event){
    console.log("testagain")
    console.log(event)
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

  potentialcbcustomer(){

  }

  contentsite(){

  }

  ecommercesite(){

  }

  affiliatesite(){

  }

  createBounty(){

  }

  removefromlist(){

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

    console.log(141, this.sendEmailsData)
    var currentEmail = this.sendEmailsData

    console.log(126, key, value)

    this.service.editDataById(currentEmail.outreach_email_id, { key: key, value: value }).subscribe(
      (data: any) => {
        console.log(136, data, 'updated')
        this.loadNextEmail.emit('loadNextEmail')
      },
      (error: any) => {
        alert(error)
      }
    )    
  }

  ngOnInit(): void {

      console.log(27, this.sendEmailsData)

      // this.sendEmailForm = this.formBuilder.group({
      //   to: [this.sendEmailsData.from, [Validators.required, Validators.email]],
      //   from: [this.sendEmailsData.to, [Validators.required, Validators.email]],
      //   subject: [this.sendEmailsData.subject, [Validators.required]],
      //   body: ["body", [Validators.required]]
      // });

    var emailKeys = Object.keys(this.sendEmailsData);
    var emailValues = Object.values(this.sendEmailsData)
    var mergeFields = { ... this.sendEmailsData }
    var fieldsToShow = []
    var fieldsToExclude = ["Number of sources", "Pattern", "Type", "accept_all", "block", "disposable","downloads","gibberish","input","listed","modifiedAt","mx_records","owner","regexp","selected","sld","smtp_check","status","subdomain","tld","webmail","available","campaigns","tempoorary_hold","outreach_email_id",]

    console.log(199, this.sendEmailsData["brand_id"]);

       var templateFilter = {
          "filter":{
              "brand_id":this.sendEmailsData["brand_id"]
          }
        }
        
       this.service.getDistinctArrayWithIdsAndFilter("templates", "template_name", templateFilter).subscribe((data: any) => {
         console.log(457, data);
         this.templates = data;
       })

    // this.service.getDistinctArrayWithIds("templates", "template_name", true).subscribe((data: any) => {
    //      console.log(202, data)
    // })

    for(var i = 0; i < emailKeys.length; i++){
      var key = emailKeys[i];
      //console.log(key);
      if(key.indexOf("_id") != -1){
        delete mergeFields[key]
      }
      
      if(key.indexOf("_by") != -1){
        delete mergeFields[key]
      }

      if(typeof emailValues[i] == "object"){
        delete mergeFields[key]
      }

      if(typeof emailValues[i] == "boolean"){
        delete mergeFields[key]
      }

      if(typeof emailValues[i] == "number"){
        delete mergeFields[key]
      }
      // console.log(56, key)
    }

    console.log(245, emailKeys)
    
    //var tmpTemplate = { ... mergeFields }
        for(var i = 0; i < emailKeys.length; i++){

          if(this.sendEmailsData.Body.indexOf(emailKeys[i]) != -1){
            this.sendEmailsData.Body = this.sendEmailsData.Body.replace(emailKeys[i], emailValues[i])
          }

        }

    //console.log(48, Object.keys(mergeFields))
    //this.mergeFields = Object.values(mergeFields)
    //console.log(59, mergeFields)




    this.dataModel = this.sendEmailsData.Body;

    console.log(263, this.emailReceived);

    if(this.emailReceived)
    {
      this.sendEmailForm = this.formBuilder.group({
        target_keyword: [this.sendEmailsData.Keyword],
    //      target_link: [this.sendEmailsData["Blog Page"], [Validators.required, Validators.pattern(this.websiteUrlReg)]],
        target_link: [this.sendEmailsData.published_link],
        blog_page: [this.sendEmailsData["Blog Page"]],
        weight: [this.sendEmailsData["DR"]],
        suggested_keyword: [''],
        suggested_title: [''],
        to: [this.sendEmailsData.from, [Validators.required, Validators.email]],
        from: [this.sendEmailsData.to, [Validators.required, Validators.email]],
        subject: [this.sendEmailsData.subject, [Validators.required]],
        body: [this.sendEmailsData.body, [Validators.required]]
      });
    }
    else
    {
      console.log(278, this.sendEmailsData)
      this.sendEmailForm = this.formBuilder.group({
        target_keyword: [this.sendEmailsData.Keyword],
    //      target_link: [this.sendEmailsData["Blog Page"], [Validators.required, Validators.pattern(this.websiteUrlReg)]],
        target_link: [this.sendEmailsData.published_link],
        blog_page: [this.sendEmailsData["Blog Page"]],
        weight: [this.sendEmailsData["DR"]],
        suggested_keyword: [''],
        suggested_title: [''],
        to: [this.sendEmailsData["Email"], [Validators.required, Validators.email]],
        from: [this.sendEmailsData.From, [Validators.required, Validators.email]],
        subject: [this.sendEmailsData.Subject, [Validators.required]],
        body: [this.sendEmailsData.Body, [Validators.required]]
      });
    }

    // if(this.emailReceived)
    // {
    //   this.sendEmailForm.controls['to'].disable();
    //   this.sendEmailForm.controls['from'].disable();
    //   console.log(263, this.sendEmailForm.controls['to'].value)
    // }
    // else
    // {
      this.sendEmailForm.controls['to'].disable();
      this.sendEmailForm.controls['from'].disable();
    // }

  }

  // disable_status = false

  badgesEvent($event){
    
  }

  templateSelected(template_id){
    if(template_id){
      this.service.getDistinctTemplateById("templates", template_id).subscribe((data: any)=>{
        console.log(320,data)
        this.dataModel = data.body
      })
    }
  }

  onFormSubmit(form: NgForm) {

    console.log(77, this.dataModel);

    if(this.dataModel)
    {
      this.sendEmailForm.controls['body'].setValue(this.dataModel)
    }
    else
    {
      this.sendEmailForm.controls['body'].setErrors({required:true})
    }
    
    var error504 = false
    //this.sendEmailErrorMessage = false
    // this.globalVars.isLoadingButton = true
    // stop here if form is invalid
    if (this.sendEmailForm.invalid) {
      this.submitted = true
      // this.disable_status = true
      console.log('from invalid');
      this.globalVars.isLoadingButton = false
      this.globalVars.disableLoadingButton = false
      return;
    } else {
      // this.disableButton(id)
      // this.disable_status = true
      this.submitted = true
      this.globalVars.isLoading = true
      console.log(80, this.sendEmailForm)
      console.log(324, this.sendEmailsData.outreach_email_id)
      if(this.emailReceived)
      {
        var body = {
          target_keyword: this.sendEmailsData.Keyword,
    //      target_link: [this.sendEmailsData["Blog Page"], [Validators.required, Validators.pattern(this.websiteUrlReg)]],
          target_link: this.sendEmailsData.published_link,
          blog_page: this.sendEmailsData["Blog Page"],
          weight: this.sendEmailsData["DR"],
          to: this.sendEmailsData.from,
          from: this.sendEmailsData.to,
          subject: this.sendEmailForm.get("subject").value,
          body: this.dataModel,
          brand_id:this.sendEmailsData.brand_id,
          bounty_id:this.sendEmailsData.bounty_id,
          outreach_email_id: this.sendEmailsData.outreach_email_id
        };
      }
      else {
        var body = {
          target_keyword: this.sendEmailsData.Keyword,
    //      target_link: [this.sendEmailsData["Blog Page"], [Validators.required, Validators.pattern(this.websiteUrlReg)]],
          target_link: this.sendEmailsData.published_link,
          blog_page: this.sendEmailsData["Blog Page"],
          weight: this.sendEmailsData["DR"],
          to: this.sendEmailsData["Email"],
          from: this.sendEmailsData.From,
          subject: this.sendEmailForm.get("subject").value,
          body: this.dataModel,
          brand_id:this.sendEmailsData.brand_id,
          bounty_id:this.sendEmailsData.bounty_id,
          outreach_email_id: this.sendEmailsData.outreach_email_id
        };
      }

      console.log(358, body)
  //     // this.emailSentSuccessfully.emit(true)

      this.service.sendSniperEmails(body)
      .pipe(timeout(10000))
      .subscribe(
        (data: any) => {
          if(data.error)
          {
            this.globalVars.isLoadingButton = false;
            this.globalVars.disableLoadingButton = false;
            this.emailSendErrorMessage = "Something wrong! Could not send email!"
          }
          else
          {
            this.globalVars.isLoadingButton = false;
            this.globalVars.disableLoadingButton = false;
            // this.emailSendErrorMessage = "Something wrong! Could not send email!"
            console.log(94, data);
            alert("Email Sent");
            this.globalVars.isLoading = false;
            this.loadNextEmail.emit('loadNextEmail')
            this.emailSentSuccessfully.emit(true)
          }
        },
        (error: any)=>{
          console.log(379, error)
          this.globalVars.isLoadingButton = false;
          this.globalVars.disableLoadingButton = false;
          this.globalVars.isLoading = false
          if(error.message){
            this.emailSendErrorMessage = error.message
            alert("Request Timeout! Please try again!")
          }
          if(error.ErrorDetails){
            this.emailSendErrorMessage = error.ErrorDetails.Description
            alert(this.emailSendErrorMessage)
          }
        })
    }
  }
}