import { Component, OnInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '../../_services/shared.service'
import { BaseComponent } from '../base/base.component';
import { AddKeywordService } from './addkeyword.service'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';

@Component({
  selector: 'app-addkeyword',
  templateUrl: './addkeyword.component.html',
  styleUrls: ['./addkeyword.component.css']
})

export class AddkeywordComponent extends BaseComponent implements OnInit {

  public filter = ""
  public brands = []
  public bountyBatch: string = "";
  public brandName: string = "";
  public columnsStr = "Keyword,Title,Volume,Difficulty,Type,Orangic,Words-Body,Words-Heading,Title,H1 Title";
  public brand_id = "";

  @ViewChildren(FlexibleComponent) flexTables: QueryList<any>

  constructor(
    public service: AddKeywordService, 
    public elementRef: ElementRef, 
    public sharedService: SharedService, 
    public router: Router,
    public route: ActivatedRoute) 
    {
         super(service, elementRef) 

         this.route.queryParams.subscribe(params => {
            console.log(38, params);
            this.bountyBatch = params["batch"];
            this.brandName = params["brand_name"];
            this.brand_id = params["brand_id"];
            this.filter = `{"brand_id":"${this.brand_id}", "bKeywordDeployed": { "$ne": true} }`
        });


  }

  // constructor(private router: Router, private route: ActivatedRoute) {

  //   this.route.queryParams.subscribe(params => {
  //           this.bountyBatch = params["batch"];
  //           this.brandName = params["brand_name"];
  //           console.log(21, this.bountyBatch, this.brandName)
  //       });

  // 	//console.log(15, this.router.getCurrentNavigation().extras);
  // 	//this.bountyBatch = this.router.getCurrentNavigation().extras["batch"];
  //   //this.brandName = this.router.getCurrentNavigation().extras["brand_name"];
  // 	//console.log(18, this.bountyBatch, this.brandName);
  // }

  viewMode = 'keywords';

  ngOnInit() {
  	
  }

  ngAfterViewInit() {
    this.service.getDistinctArrayWithIds("brands", "brand_name", false).subscribe((data: any) => {
         this.brands = data;
    })
  }


drop(event: CdkDragDrop<string[]>) {
      console.log("drop from addkeyword");
      this.sharedService.drop(event);
  }

//   dropItemReceived($event: any){
//     // Since I only expect to receive "Keywords", "Titles" or "Prompts" here, I will add them into
//     // the MongoDB document associated with this row.
//     console.log(63, "Drop Item Received");
    
//     var _id = $event["_id"];
//     delete $event["_id"];
//     var keys = Object.keys($event);
//     console.log(64, keys)
//     this.pushValueIntoArray(_id, keys[0], $event[keys[0]], true);  
//   }
// }

  dragFrom: string = "";

  dragStart(ev, dragType, data) {
    console.log(840, "Drag Start")
    ev.target.id = "taskid";
    if(dragType == 'keywords'){
      this.dragFrom = "keywords"
    }
    // if(dragType == 'add_title'){
    //   this.dragFrom = "titles"
    // }
    // if(dragType == 'add_prompt'){
    //   this.dragFrom = "prompts"
    // }

    var dropOriginData = {
      dragType: dragType,
      droppedData: data
    }
    
    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("dropOriginData", JSON.stringify(dropOriginData));
  }

  onDragStart(ev, dragType){
    var data = ev.dataTransfer.getData('data');  
    this.dragFrom = dragType; 
    ev.target.id = "taskid";
    this.dragFrom = dragType;
    var dataDocId = "";
    var dropOriginData = {
      dragType: dragType,
      droppedData: data,
      droppedDataId: dataDocId
    }
    
    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("dropOriginData", JSON.stringify(dropOriginData));
  }

  onDragEnd(e){
    console.log(403, "onDragEnd");
    this.dragFrom = "";
  }

  onDragEnter(e){
    console.log(870, e);
    //console.log(407, "onDragEnter");
  }
  
  onDragLeave(e){

    //console.log(411, "onDragLeave");
  }
  
  onDragOver(e){
    console.log(878, this.dragFrom, e.key);
    if(this.dragFrom == e.key){
      e.event.preventDefault();  
    }
  }
  
  onDropEvent(e){
    //e.preventDefault();
    console.log(419, "onDropEvent");
  }

  dropItemReceived($event: any) {

    var droppedData = JSON.parse($event["droppedData"]);
    console.log(145, droppedData)

    var obj = JSON.parse(droppedData.obj);
    delete obj["_id"];
    var droppedDataDocumentId = droppedData["_id"];
    console.log(662, "Dropped Data Document Id", droppedDataDocumentId);
    var _id = $event["_id"];
    this.service.key = "bounties"
    this.pushValueIntoArray(_id, "keywords", droppedData['data'], true);
    this.pushValueIntoArray(_id, "titles", obj["Title"], true);
    this.pushValueIntoArray(_id, "volumes", obj["Volume"], true);
    this.pushValueIntoArray(_id, "difficulties", obj["Difficulty"], true);
    // Update the droppedDataDocumentId from the 'keywords' collections and refresh the table
    this.service.key = "keywords";

    this.service.addDataById(droppedDataDocumentId, 
      { 
        bounty_id: _id, 
        bKeywordDeployed: true,
        ... obj 
      }).subscribe(
        (data: any) => {   
    // In this case, I want to delete the keyword....
            console.log(this.flexTable);
            //this.flexTable.refreshTableData()
             this.flexTables.forEach(hello => {
               console.log(hello)
               hello.refreshTableData()
             });

        })
    }

    receivedTableData($event) {

      console.log(200, $event);

    }

    // swapKeywordToFront(tmpAr: any) {
    //   var rVal = Array.concat([], tmpAr);
    //   console.log(rVal)
    //   var keywordPos = 0;
    //   for(var i = 0; i < tmpAr.length; i++){
    //     if(tmpAr[i] == "Keyword")
    //       keywordPos = i;
    //   }

    //   var tmp = rVal[i];
    //   rVal[0] = tmpAr[keywordPos];
    //   rVal[i] = tmp;
    //   return rVal;
    // }

    flextableHeaderButtonClicked($event) {
        var requestBody = JSON.parse(this.filter);
        this.service.getKeysForSearchQuery("keywords", requestBody).subscribe((data: any) => {
          this.columnsStr = data.keywords.join(",");
          this.flexTables.forEach(hello => {
               if(hello.columns == "Keyword,Title,Volume,Difficulty,Type,Orangic,Words-Body,Words-Heading,Title,H1 Title"){
                 hello.columns = data.keywords.join(",");
                 hello.widthsAr = new Array(data.keywords.length).fill(200);
                 console.log(hello)
                 hello.refreshTableData()
               }
          });
        })
    }
























}