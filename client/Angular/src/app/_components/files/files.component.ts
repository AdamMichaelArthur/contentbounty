import { Component, OnInit, Input, Output } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { EventEmitter } from '@angular/core';

import voca from 'voca';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent extends BaseComponent implements OnInit {

	@Input() response;
  @Output() _hideMe = new EventEmitter<boolean>();

	googleDocs = [];
  googleSheets = [];

  hasBountyScript = false;

	keywords = [];

  bounty_id = "";
  code_generator_url_prefilled = "";
  scriptLink = "";
  scriptId = ""
  updateAction = "";

  completeBounty($event){
    console.log(26, this.bounty_id);
    return false;
  }

  openPopup($event) {
    console.log($event);
    document.getElementById("popup-overlay").style.display = "block";
    this.updateAction = $event;
}

closePopup() {
  document.getElementById("popup-overlay").style.display = "none";
}

editSpreadsheet(){

}

editDocument(){

}

updateBounty($event){

  console.log(53, this.updateAction);

  this.updateScriptId($event, this.updateAction)

}

updateScriptId($event, action){
  this.hasBountyScript = true;

  this.scriptLink = this.scriptId;

  console.log(44, `updateBounty${action}`, this.scriptLink);

  this.service.dynamicButton("bounty", this.bounty_id, `updateBounty${action}`, { "script_link": this.scriptId} ).subscribe((data) => {
    if(action == 'script'){
     this.bountyScript = data["actions"]["script_id"];
    }

    if(action == 'spreadsheet'){
     this.bountySpreadsheet = data["actions"]["script_id"];
    }

    if(action == 'document'){
     this.bountyDocument = data["actions"]["script_id"];
    }

     console.log(51, this.bountyScript, data);
     this.closePopup()
     this.scriptId = "";
  });

  // Update the database...
}

ngOnInit(): void {
  console.log(15, this.response);

  // Set properties for spreadsheet and document
  this.bountySpreadsheet = this.response.bountySpreadsheet;
  this.bountyDocument = this.response.bountyDocument;

  // Check if bountyScript exists and set properties accordingly
  if (typeof this.response.bountyScript !== 'undefined') {
    this.hasBountyScript = true;
    this.bountyScript = this.response.bountyScript;
    this.scriptLink = `https://docs.google.com/document/d/${this.bountyScript}/edit`;
  }

  // Set properties for bounty_id and document links
  this.bounty_id = this.response._id;
  this.documentLink = `https://docs.google.com/document/d/${this.bountyDocument}/edit`;
  this.documentDownloadLink = `https://docs.google.com/document/d/${this.bountyDocument}/export?format=doc`;

  // Set properties for spreadsheet links and download links
  this.spreadsheetLink = `https://docs.google.com/spreadsheet/d/${this.bountySpreadsheet}/edit`;
  this.spreadsheetDownloadLink = `https://docs.google.com/feeds/download/spreadsheets/Export?key=${this.bountySpreadsheet}&exportFormat=xlsx`;

  // Check if docs exists and set properties accordingly
  if (typeof this.response.docs !== 'undefined') {
    for (var doc of this.response.docs) {
      doc.filename = voca.replaceAll(doc.filename, "_", " ");
      doc.filename = voca.replaceAll(doc.filename, "-", " ");
      doc.filename = voca.titleCase(doc.filename);

      if (doc.filename.indexOf(".Docx") !== -1) {
        doc.link = `https://docs.google.com/document/d/${doc.id}/edit`;
        doc.download_link = `https://docs.google.com/document/d/${doc.id}/export?format=doc`;
      }

      if (doc.filename.indexOf(".Xlsx") !== -1) {
        doc.link = `https://docs.google.com/spreadsheets/d/${doc.id}/edit#gid=0`;
        doc.download_link = `https://drive.google.com/uc?export=download&id=${doc.id}`;
      }

      doc.filename = voca.replaceAll(doc.filename, ".Docx", " / docx - Document")
      doc.filename = voca.replaceAll(doc.filename, ".Xlsx", " / xlsx - Spreadsheet")

      console.log(48, doc);
    }

    this.googleDocs = this.response.docs;
  }

  // Set properties for keywords
  this.keywords = []
  for (var keyword of this.response.keywords) {
    keyword = voca.titleCase(keyword);
    console.log(128, keyword);
    this.keywords.push(keyword);
  }

  // Check if code generator url exists and set properties accordingly
  if (typeof this.response.code_generator_url !== 'undefined') {
    this.code_generator_available = true;
    this.code_generator_url_prefilled = this.response.code_generator_url + "?" + "asset_url=" + this.response.localFolder + "&primaryKeyword=" + this.keywords[0] + "&excel=" + this.spreadsheetDownloadLink + "&word=" + this.documentDownloadLink;
  }

  // Set properties for googleSheets
  if (typeof this.response.spreadsheets !== 'undefined') {
    this.googleSheets = this.response.spreadsheets;
  }
}


  // hidePopup() {
  // 	console.log(44, this.displayTableButtonArea);
  // 	this.displayPopup.emit(false);
  // 	//this.displayTableButtonArea = false;
  // }

}
