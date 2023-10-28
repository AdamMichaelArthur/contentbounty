
import { Component, OnInit, ElementRef,   ViewChild, ViewChildren, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component'
import { BaseService } from './base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';

declare var Box:any;

@Component({
  selector: 'app-base',
  template: 'NO HTML TO BE FOUND HERE',
  styleUrls: ['./base.component.css']
})

export class BaseComponent implements OnInit {

  @Output() displayPopup: EventEmitter<any> = new EventEmitter();
  @Input() btn_response;

  errorFound = false
  errorMessage = {}
  response: any
  displayTableButtonArea: Boolean = false;
  filters: Array<any> = [];
  iconMenus: Array<any> = [];
  iconMenusStr = "";
  filtersStr = "";
  addDataForm = [];
  addDataFormStr = "";
  googleDocs = [];
    kickbackStep = "";
      kickbackreason = "";
        processSteps = []
          spreadsheetLink = "#";
            documentLink = "#";
              documentDownloadLink = "#";
                spreadsheetDownloadLink = "#";

  code_generator_available = false;

  @ViewChild(FlexibleComponent)
  flexTable: FlexibleComponent;

  refreshTable() {
    console.log("Refreshing FlexTable");
    this.flexTable.getInitialDataTableList()
  }

  kickbackReason(response){
    console.log(44, this.kickbackStep, this.kickbackreason, response)

    this.service.postAction("bounty", "kickbackToStep", { "kickbackStep": this.kickbackStep, "bounty_id" : response.bounty.bounty_id, "refDocId":response.bounty.refDocId, "kickback_reason":this.kickbackreason }).subscribe((data: any) => {
          this.tableButtonSubviews[3] = false;
          this.displayTableButtonArea = false;
    })

    // this.service.postAction("bounty", "kickbackreason", { "bounty_id" : response.bounty.bounty_id, "refDocId":response.bounty.refDocId, "kickback_reason":this.kickbackreason }).subscribe((data: any) => {
    //       this.tableButtonSubviews[3] = false;
    //       this.displayTableButtonArea = false;
    // })

  }

  constructor(public service: BaseService, public elementRef: ElementRef) { }

  ngOnInit() {
    //  Go through our filters.
    //  if(this.filters.length > 0){
    //   // Use datasource API to fill out the valueKeys of each dropdown

    //   for(var i = 0; i < this.filters.length; i++){
    //         var filter = this.filters[i]
    //         filter.valueKeys = ["test1", "test2"];    
    //         this.service.getFilterOptions(filter).subscribe(
    //           (data: any) => {      
    //             filter.valueKeys = data[data.datasource]
    //             filter.valueKeys = ["test1", "test2"]; 

    //             for(var y = 0; y < this.filters.length; y++){
    //               if(this.filters[y].datasource == data.datasource){
    //                 this.filters[y].valueKeys = data[data.datasource];
    //                 // I need to notify the component of the change in data...how?
    //                 //console.log(40, this.filters[y].valueKeys);
    //               }
    //             }
    //           })
    //   }
    // }
    this.filtersStr = JSON.stringify(this.filters);
  }

  compact: boolean = true
  displayButtonArea: boolean = true;
  buttonNames: Array<string> = []
  buttonSubviews: Array<boolean> = []
  tableButtonNames: Array<string> = []
  tableButtonSubviews: Array<boolean> = []

  openSnackBar(message, cssClass) {
    // this._snackBar.openFromComponent(SnackbarComponent, {
    //   duration: 5000,
    //   verticalPosition: 'top',
    //   horizontalPosition: 'right',
    //   panelClass: cssClass,
    //   data: message
    // });
  }

  openPage(routename: string) {
    //this.router.navigateByUrl(`/${routename}`);
  }

  consoleText() {
    console.log(77, "This is a test")
  }

  lastButtonClicked: string = "";
  flextableHeaderButtonClicked(buttonName: any) {

    var status = this.buttonClicked(buttonName);
    if(status == false){
      return;
    }
    
    console.log(89, buttonName);
    if(this.lastButtonClicked == buttonName){
         this.displayButtonArea = !this.displayButtonArea;
         return;
    }

    if((this.lastButtonClicked == "") && (this.displayButtonArea == true)){
         this.displayButtonArea = !this.displayButtonArea;
    } else if((this.displayButtonArea == true) && (buttonName != this.lastButtonClicked)){
         this.displayButtonArea = false;
    }


    this.lastButtonClicked = buttonName;

    var div = document.getElementById("id-Action1");
    // if(div == null){
    //   return;
    // }

    var button = document.getElementById(buttonName)
    var buttonRect = button.getBoundingClientRect();
    var container = document.getElementById("page_container").getBoundingClientRect();
    div.style.top = String(buttonRect.bottom) + "px"
    var divRect = document.getElementById(buttonName).getBoundingClientRect();
    var container = document.getElementById("page_container").getBoundingClientRect();
    var test = divRect.left - container.left + 15
    div.style.left = String(test) + "px";
  }

  buttonClicked(buttonName: string){
    console.log(110, buttonName)

    if(buttonName == "Delete Selected"){
      // This is a special keyword
      var deleteSelected = confirm("Delete selected items?  Warning: this cannot be undone.");
      if(deleteSelected){

        this.service.deleteSelected().subscribe(
               (data: any) => {   
                   this.refreshFlextable()
       
               });
        return false;
        // Send a command to the server indicating that everything should be deleted.
      }
    }

      for(var i = 0; i < this.buttonNames.length; i++){
          if(this.buttonNames[i] == buttonName){
            this.buttonSubviews[i] = true; 
          } else {
            this.buttonSubviews[i] = false; 
          }
        }
    return true;
  }

   displayTableButtonUI(tableButtonName: string){
       for(var i = 0; i < this.tableButtonNames.length; i++){
           if(this.tableButtonNames[i] == tableButtonName){
             this.tableButtonSubviews[i] = true; 
           } else {
             this.tableButtonSubviews[i] = false; 
           }
         }
     return true;
   }

   updateHeaderButtons(headerButtons: string) {
     this.buttonNames = headerButtons.split(",");
     for(var i = 0; i < this.buttonNames.length; i++){
       this.buttonSubviews[i] = false;
     }
   }

   updateTableButtons(tableButtons: string) {
     this.tableButtonNames = tableButtons.split(",");
     for(var i = 0; i < this.tableButtonNames.length; i++){
       this.tableButtonSubviews[i] = false;
     }
   }

   tableButtonClicked($event){

    this.response = $event
    console.log(95, this.response);
    this.displayTableButtonUI(this.response.button)
    this.displayTableButtonArea = !this.displayTableButtonArea

    if(($event.button == "Files")||($event.button == "Template")){
      this.bountySpreadsheet = $event.bountySpreadsheet
      this.bountyDocument = $event.bountyDocument

      var contentExplorer = new Box.ContentExplorer();
        setTimeout((accessToken, folderId) => {
          contentExplorer.show(folderId,accessToken,{
            container:  "#my-box-content-explorer"
        });
       },500, $event.accessToken, $event.folderId)      
    }

  }

  hideHeaderButtonArea(){
    console.log(126, "Hiding Area");
    this.displayButtonArea = true;  
  }
  
   hideTableButtonArea(){
    console.log(131, "Hiding Area");
    this.displayTableButtonArea = false;  

  }
  
  refreshFlextable(){
    console.log(162, "Base refresh flextable called");
    this.flexTable.getInitialDataTableList()
  }

  hideBounty(){
    this.displayTableButtonArea = false;  
  }

  displayIconMenu: boolean = false;

  showIconMenu(event){
    this.displayIconMenu = true;
    this.onMouseClick(event);
  }

  hideIconMenu(){
    this.displayIconMenu = false;
  }
  
  onMouseClick(e: any) {
      
      e.srcElement.style.color = "black"
      console.log(e.srcElement);

      var myRect = e.srcElement.getBoundingClientRect();
      console.log(180, myRect);
      var parentRect = this.elementRef.nativeElement.getBoundingClientRect();
      console.log(182, parentRect)

      var popupX = myRect.x - parentRect.x + 20;
      var popupY = myRect.y + (myRect.height/2)
      //e.srcElement.left = popupX + 20;
      //e.pageX will give you offset from left screen border
      //e.pageY will give you offset from top screen border
      var iconmenu = document.getElementById("iconmenu");
      iconmenu.style.left = String(popupX) + "px";
      iconmenu.style.top = String(popupY) + "px"
      //determine popup X and Y position to ensure it is not clipped by screen borders
      const popupHeight = 400, // hardcode these values
        popupWidth = 300;    // or compute them dynamically

      let popupXPosition,
          popupYPosition

      if(e.clientX + popupWidth > window.innerWidth){
          popupXPosition = e.pageX - popupWidth;
      }else{
          popupXPosition = e.pageX;
      }

      if(e.clientY + popupHeight > window.innerHeight){
          popupYPosition = e.pageY - popupHeight;
      }else{
          popupYPosition = e.pageY;
      }

    }

    pushValueIntoArray(id, key, value, pluralize =false){
      console.log(219, "sending addToArray", id, key, value, pluralize);
      this.service.addToArray(id, key, value, pluralize).subscribe(
               (data: any) => {   
                   this.refreshFlextable()
       
               });
    }

    pullValueFromArray(id, key, value, pluralize =false){
      console.log(219, "trying to remove from array", id, key, value, pluralize);
      this.service.pullFromArray(id, key, value, pluralize).subscribe(
               (data: any) => {   
                   this.refreshFlextable()
               });
    }

  // private _displayTableButtonArea: Boolean = false;

  // get displayTableButtonArea(): Boolean {
  //   console.log(317, this._displayTableButtonArea)
  //   return this._displayTableButtonArea 

  // }

  // set displayTableButtonArea(val: Boolean) {
  //   //do some extra work here
  //   console.log(317, this._displayTableButtonArea)
  //   this._displayTableButtonArea = !this._displayTableButtonArea
  // }


   hidePopup(){
     console.log(232, "Hide popup", this.displayTableButtonArea)
    this.displayTableButtonArea = !this.displayTableButtonArea
    this.displayPopup.emit(false);
    this.refreshTable()
  }

  bountySpreadsheet = ""
  bountyDocument = ""
  bountyScript = "";

  openFile($event, id, filename){
      console.log(415, $event, id, filename)
      $event.preventDefault();

    if(filename.indexOf("xlsx") != -1){
      var spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${id}/edit#gid=0`  
      window.open(spreadsheetUrl, "_blank");
    }

    if(filename.indexOf("docx") != -1){
      var documentUrl = `https://docs.google.com/document/d/${id}/edit`;  
      window.open(documentUrl , "_blank");
    }

    return false;

  }

  openSpreadsheet($event, id =null){

        var spreadsheetId = this.bountySpreadsheet
        if(id != null){
          spreadsheetId = id;
        }
        
        console.log(411, $event)
        $event.preventDefault();
        var spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`  

        console.log(366, spreadsheetUrl);

         window.open(spreadsheetUrl, "_blank");
        return false;
    }

    openDocument($event){
        console.log(415, $event)
        $event.preventDefault();  
        var documentUrl = `https://docs.google.com/document/d/${this.bountyDocument}/edit`;
         window.open( documentUrl, "_blank");
        return false;
    }

    openScript($event){

        $event.preventDefault();  
        var documentUrl = `https://docs.google.com/document/d/${this.bountyScript}/edit`;
         window.open( documentUrl, "_blank");
        return false;
    }
}
