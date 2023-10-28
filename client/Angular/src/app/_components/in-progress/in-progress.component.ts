import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { FlexibleTableService } from "../flexible-table/services/flexible-table-service"
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';

import voca from 'voca';

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})

/*
          key={{key}}
          columns={{columns}}
          all={{all}}
          displayFileUpload={{displayFileUpload}}
          displayAddDataToSource={{displayAddDataToSource}}
          noDisplayColumns={{noDisplayColumns}}
          aggregate="{{ aggregateStr }}"
          currencyColumns={{bounty}}
          noTextColumns={{noTextColumns}}
          displayClone={{displayClone}}
          displayDelete={{displayDelete}}
          buttons={{buttons}}
          buttonNames={{buttonNamesStr}}
          widths={{widths}}
          (tableButtonClicked)="tableButtonClicked($event)"
          (sendTableButtons)="updateTableButtons($event)"
          maxCharactersStr="18,18,15,15,15,15,15,15,15"
*/

export class InProgressComponent extends BaseComponent implements OnInit {

  disableDropdown = false;






  iconMenus = [
    [
    ]
  ]

  iconMenuRoutes = [
    [
    ]
  ]

  filters = [
    {
      "filter": { "brand_name": "" },
      "label": "Brand",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",
      "all":false
    },
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

  iconMenusStr = "";
  iconMenuRoutesStr = "";


  keywords = [];


  displayDeployedInfo = false;


  tableButtonClicked($event){
    console.log(27, "tableButtonClicked", $event);

    if($event.button == "Unclaim"){
      //console.log(49, $event);
      //if($event.result == false){
        alert("You have unclaimed this bounty.  Any work you did, if any, will not be compensated.")
      //}
      //this.refreshTable();
      return this.refreshTable();
    }

    if($event.button == "Files"){

      return super.tableButtonClicked($event)
      // console.log(124, $event);
      // this.bountySpreadsheet = $event.bountySpreadsheet
      // this.bountyDocument = $event.bountyDocument

      // this.spreadsheetLink = `https://docs.google.com/document/d/${this.bountySpreadsheet}/edit`;
      // this.documentLink = `https://docs.google.com/document/d/${this.bountyDocument}/edit`;
      // // documentLink

      // if(typeof $event.docs != 'undefined'){
      //   for(var doc of $event.docs){
      //     doc.filename = voca.replaceAll(doc.filename, "_", " ");
      //     doc.filename = voca.replaceAll(doc.filename, "-", " ");
      //     doc.filename = voca.titleCase(doc.filename);
          
      //     if(doc.filename.indexOf(".Docx") != -1){
      //       doc.link = `https://docs.google.com/document/d/${doc.id}/edit`;
      //       doc.download_link = `https://docs.google.com/document/d/${doc.id}/export?format=doc`;

      //     }
      //     if(doc.filename.indexOf(".Xlsx") != -1){
      //       doc.link = `https://docs.google.com/spreadsheets/d/${doc.id}/edit#gid=0`;
      //       doc.download_link = `https://drive.google.com/uc?export=download&id=${doc.id}`;
      //       //https://docs.google.com/feeds/download/spreadsheets/Export?key={GOOGLE_SPREADSHEET_KEY}&exportFormat=xlsx
      //     }

      //     console.log(131, doc.filename, doc.link, doc.download_link);

      //     doc.filename = voca.replaceAll(doc.filename, ".Docx", " / docx - Document");
      //     doc.filename = voca.replaceAll(doc.filename, ".Xlsx", " / xlsx - Spreadsheet");

          
      //   }
      //   this.googleDocs = $event.docs;
      //   this.keywords = []
      //   for(var keyword of $event.keywords){
      //     keyword = voca.titleCase(keyword);
      //     console.log(128,keyword)
      //     this.keywords.push(keyword)
      //   }
      // }

      // if(typeof $event.code_generator_url != 'undefined'){
      //   this.code_generator_available = true;
      // }

      
    }
    
    if($event.button == "Complete"){
      console.log(49, $event);
      if($event.result == false){
        alert($event.message)
      }
      this.refreshTable();
      return;
    }

    
    if($event.button == "Undo Complete"){
        alert("This feature is still in-progres")
      return;
    }

    if($event.button == "Kickback"){

        console.log(135, "Kickback Clicked");
        this.processSteps = $event.bounty.prevSteps;
        this.tableButtonSubviews[3] = true;
        super.tableButtonClicked($event);
        return;
        

        if(this.response.error == 1631){
          this.tableButtonSubviews[3] = false;
          this.displayTableButtonArea = false;
          alert(this.response.result)
          return;
        }

        this.refreshTable()
        console.log(74, this.response);

        return 
    }
  
    if($event.button == "Publish"){
      if($event.result == false){
        alert($event.msg);

        return cleanup(this.flexTable);
      }  

      console.log(53, $event);
      this.refreshTable();
      return cleanup(this.flexTable);
    }

    if($event.button == "Link"){
      var link = prompt("Please cut and paste the final link to the content here");

      if (link != null) {
        // Publish the link
        this.service.postAction("bounty", "postlink", { ... $event, "link":link }).subscribe((data: any) => {
          console.log(60, data);
        })
      } else {
        alert("You didn't put any text...cancelling")
      }
      return cleanup(this.flexTable);
    }

    function cleanup(flexTable){
    //super.tableButtonClicked($event);

    console.log(84, $event);

    flexTable.resetRowAnimation($event._id, $event.row)

    }

    //cleanup()  
  }

  key="bounty"
  columns="brand_name,content_type,pipeline,keywords,prompts,titles,bounty,name,description,skills,brand_id,completion_order,refDocId"
  all="progress"
  displayFileUpload="false"
  displayAddDataToSource="false"
  noDisplayColumns="refDocId,brand_id,completion_order,name,description,skills,bounty,name"
  currencyColumns="bounty"
  noTextColumns="refDocId,brand_id,completion_order"
  displayClone="false"
  displayDelete="false"
  buttons="brand_name,brand_name,brand_name,brand_name"
  buttonNamesStr="Complete,Files,Unclaim,Kickback"
  widths="0,600,150,150,300,60,160,170,200,200,200,0,0"
  textCutoff = [20, 15, 15, 10, 10, 20, 20, 26, 15]

  aggregateStr = `[
    { $project:{
        brand_name:1,
        content_type:1,
        pipeline:1,
        keywords:1,
        prompts:1,
        titles:1,
        process:1,
        published_link:1,
        brand_id:1
    }},
    {$unwind:"$process"},
    {$match:
      { $and:
        [  
          {"process.bStatus": false},
          {"process.pipeline":"$res.locals.user._id"},
          {"process.status":"incomplete"}
        ]
      }
    },
    { $project:{

        brand_name:1,  
        content_type:1,
        bounty:"$process.bounty",
        name:"$process.name",
        description:"$process.description",
        pipeline:"$process.name",
        keywords:1,
        prompts:1,
        titles:1,
        skill:"$process.skills",
        published_link:1,
        refDocId:"$process.refDocId",
        completion_order:"$process.completion_order",
        brand_id:1
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
                      pipeline:"$pipeline",
                      keywords:"$keywords",
                      prompts:"$prompts",
                      titles:"$titles",
                      bounty:"$bounty",
                      name:"$name",
                      description:"$description",
                      skill:"$skill",
                      brand_id:"$brand_id",
                      completion_order:"$completion_order",
                      refDocId:"$refDocId",
                    } 
                  ] 
              } 
        }
    }
]`

  constructor( private router: Router, 
    public service: BaseService, public elementRef: ElementRef,
    public flexibleTableService: FlexibleTableService) 
  {
    super(service, elementRef) 
    this.iconMenusStr = JSON.stringify(this.iconMenus)
    this.iconMenuRoutesStr = JSON.stringify(this.iconMenuRoutes)
  }

  userInfo = {}

  ngOnInit(): void {

    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

    super.ngOnInit()

    //const v = require("voca");

  }

  bAddedButtons = false;
    receivedTableData($event) {

      var customizeForTheseSkills = []

      
      for(var i = 0; i < this.flexTable.tableData.length; i++){
        var tableRow = this.flexTable.tableData[i];
        var rowSkillsRequiredAr = tableRow["skill"];
        var userSkills = this.userInfo["skills"];
        console.log(303, userSkills, tableRow);
        var skillsToCustomizeTableRowButtonFor = rowSkillsRequiredAr.filter(value => userSkills.includes(value));

        console.log(305, skillsToCustomizeTableRowButtonFor);

        if(Array.isArray(skillsToCustomizeTableRowButtonFor == false)){
          skillsToCustomizeTableRowButtonFor = [skillsToCustomizeTableRowButtonFor]
        }

          if(skillsToCustomizeTableRowButtonFor.indexOf("wordpress") != -1){
            if(this.bAddedButtons == false){
            this.flexTable.addButton(i, "Publish", "brand_name")
            this.flexTable.addButton(i, "Link", "brand_name")
            this.bAddedButtons = true;
          }
          }

          if(skillsToCustomizeTableRowButtonFor.indexOf("html_css_javascript") != -1){
            if(this.bAddedButtons == false){
            this.flexTable.addButton(i, "Publish", "brand_name")
            this.flexTable.addButton(i, "Link", "brand_name")
            this.bAddedButtons = true;
          }
          }

          if(skillsToCustomizeTableRowButtonFor.indexOf("uploading") != -1){
            if(this.bAddedButtons == false){
            this.flexTable.addButton(i, "Publish", "brand_name")
            this.flexTable.addButton(i, "Link", "brand_name")
            this.bAddedButtons = true;
          }
          }
          //

        for(var y = 0; y < skillsToCustomizeTableRowButtonFor.length; y++){
          var skill = skillsToCustomizeTableRowButtonFor[y];
          //console.log(225, skill)



           if((skill == "skyscraper_prospecting")||(skill == "referring_domains")){
             setTimeout((row) => {
                  this.flexTable.changeMenuItem(row, "Upload Reffering Domains", "upload-referring-domains") 
             }, 1500, i)          
            }

           if(skill == "email_prospecting"){
             setTimeout((row) => {
                  this.flexTable.changeMenuItem(row, "Upload Email Addresses", "upload-email-prospects") 
             }, 1500, i)          
            }


           if(skill == "skyscraper-email-finding"){
             setTimeout((row) => {
                  this.flexTable.changeMenuItem(row, "Upload Email Addresses", "upload-email-prospects") 
             }, 1550, i)          
            }
          
          if(skill == "keyword_research"){
             setTimeout((row) => {
                  this.flexTable.changeMenuItem(row, "Sniper Keyword Research", "sniper-campaign-research") 
             }, 1550, i)          
            }

          if(skill == "create_bounties_sniper_outreach"){
             setTimeout((row) => {
                  this.flexTable.changeMenuItem(row, "Create Sniper Outreach Campaign", "sniper-outreach-campaign") 
             }, 1550, i)
           }

           if(skill == "content-bounty-lead-tool"){
             setTimeout((row) => {
                  this.flexTable.changeMenuItem(row, "Create Email Campaign", "campaigns") 
             }, 1550, i)          
            }

           // if(skill == "link-building-communication"){
           //   setTimeout((row) => {
           //        this.flexTable.changeMenuItem(row, "Create Email Campaign", "campaigns") 
           //   }, 1550, i)          
           //  }
        }
      }

      if(this.bAddedButtons == true){
        console.log(386, "Should Add Buttons");
        //this.flexTable.loadingDataTablePagination(250);
      }
    }   

    // openSpreadsheet($event){
    //     console.log(411, $event)
    //     $event.preventDefault();
    //     var spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${this.bountySpreadsheet}/edit#gid=0`  
    //      window.open(spreadsheetUrl, "_blank");
    //     return false;
    // }

    // openDocument($event){
    //     console.log(415, $event)
    //     $event.preventDefault();  
    //     var documentUrl = `https://docs.google.com/document/d/${this.bountyDocument}/edit`;
    //      window.open( documentUrl, "_blank");
    //     return false;
    // }

    createBountySpreadsheet(){

    }
}
