
/*
    Reviewed 12/21/2019 by Adam Arthur
  
    loadpagi(url) -- this function contains a spelling error, and should be
    camelCase, i.e. loadPage(url)

    commented code that is dead should be removed

    otherwise no comments 
*/

import { ViewChild, Component, OnInit, HostListener, EventEmitter, Output, OnDestroy, AfterViewInit, ElementRef, QueryList, ViewChildren, Input } from '@angular/core';
import { QueueService } from './queue.service';
import { Router, CanActivate } from '@angular/router';
import { Globals } from 'src/app/globals';
//import { CookieService } from 'ngx-cookie-service';
//declare const $: any;
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BaseService } from '../base/base.service'
import { BaseComponent } from '../base/base.component';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { FilesComponent } from '../files/files.component';
import { SharedService } from '../../_services/shared.service'
import { NavigationExtras } from '@angular/router'
import voca from 'voca';
import * as moment from 'moment';
import * as socketIo from 'socket.io-client';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})

export class QueueComponent extends BaseComponent implements OnInit {

  @Input() response;
  @Output() _hideMe = new EventEmitter<boolean>();

  private socket;
  public SERVER_URL = environment.websocketBase;

  openedDocuments = [];

    public initSocket(): void {
        console.log(28, this.SERVER_URL);
        this.socket = socketIo(this.SERVER_URL, {path: "/ws/socket.io"});
        //console.log(30, this.socket);
        this.socket.on('my broadcast', (data: string) => {
          console.log(31);
          //this.refreshTable()
      });

      this.socket.on('set_teleprompter_text', (data: any) => {
          //console.log(67, data)
      });

      this.socket.on('get_bounty', (data: any) => {
         // console.log(61, data)
      });

      this.socket.on('open_document', (data: any) => {
          console.log(65, data)
          if (this.openedDocuments.indexOf(data) === -1) {
            this.openedDocuments.push(data);
            window.open(`https://docs.google.com/document/d/${data}/`, "_blank");
          }
      });

    }

    ngOnDestroy() {
        this.destroySocket()
    }

  public destroySocket(): void {
      console.log(37, "disconnect?");
      this.socket.disconnect()
  }

  public onEvent(event: Event): Observable<any> {
    console.log(32, "An event has occured");
          return new Observable<Event>(observer => {
              this.socket.on(event, () => observer.next());
          });
      }

  viewMode = 'keyword';

  // dummy data for custom drop down
  d = ["Apple 1", "Apple 2", "Apple 3"]
  e = ["Oranges", "Pears", "Banans"]

  queueFilter = `{ "visible": { "$ne": false }, "archived": { "$ne": true } }`

  // queueFilter = `{ "visible": { "$ne": false }, "archived": { "$ne": true}, "process":{"$elemMatch":{"bStatus":true } } }`

  @ViewChildren(FlexibleComponent) flexTables: QueryList<any>

  isDropdownSelectdFirst = true;
  isDropdownSelectd = false;
  isDropdown = false;
  select_default_val = null;
  number: 0
  openDropDown() {
    this.isDropdown = !this.isDropdown;
    console.log(63, "openDropDown")
  }

  test(){
    console.log(60, "testing");
    this.displayTableButtonArea = false;
  }

  hideDropDown(value: any) {
    return;
    this.isDropdown = false;
    this.isDropdownSelectd = true;
    this.isDropdownSelectdFirst = false;
    this.select_default_val = value
    console.log(71, "hideDropDown")
  }
  // dummy data for custom drop down end

  content_types: Array<string> = []
  processes: Array<string> = []
  brands: Array<string> = []
  editorial_process: any = []
  content_description: string = ""
  preferred_url: string = "";
  release_for_bounty: string = "";
  word_count: string = "0";
  word_cost: string = "0";
  budget: string = "0";
  restrict_based: Boolean = false;
  dynamic_bounties: Boolean = false;
  selected_steps: Array<boolean> = []
  brand_name: string = ""
  content_type_list: Array<string> = [];
  select: string = "";

  repeat_list: Array<string> = ["Daily", "Every Other Day", "Weekly", "Bi-Weekly", "Monthly"];

  refreshTable() {
    console.log(84,"compoennt refreshTable called");
    this.flexTable.refreshTableData()
  }

  refreshFlextable(){
    console.log(91, "super refresh flextable called");
    this.refreshTable()
  }

  iconMenus = [
    {
      "icon": "format_paint",
      "menu_label": "Paint a Wall",
      "identifier": "sendsms"
    },
    {
      "icon": "format_paint",
      "menu_label": "Paint a something else",
      "identifier": "sendemail"
    },
    {
      "icon": "local_phone",
      "menu_label": "Send A Text",
      "identifier": "sendsms"
    },
    {
      "icon": "local_phone",
      "menu_label": "Email",
      "identifier": "sendemail"
    }
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
    },
    { "filter": false,
      "filterLabels": [ "Status", "Selected", "Released", "Unclaimed", "Started, Current Step Unclaimed", "Claimed, Step In Progress", "Claimed, Completed" ],
      "label": "Status",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "bounty",
      "key": "",
      "distinct": "brand_name",
      "all":false
    }
  ]

  constructor(public service: BaseService, public elementRef: ElementRef, private router: Router, public sharedService: SharedService) {
    super(service, elementRef)
  }

  ngOnInit() {
    super.ngOnInit()
    this.service.key = "bounty";
    this.initSocket();

  }

  ngAfterViewInit() {
    this.service.getDistinctArrayWithIds("brands", "brand_name", false).subscribe((data: any) => {
         this.brands = data;
    })
  }

  selectContentType(event) {
    // this.service.getArray("step", { "content_type": event.target.value }).subscribe((data: any) => {
    //   this.editorial_process = data;
    //   this.selected_steps = [];
    //   for (var i = 0; i < data.length; i++) {
    //     this.selected_steps.push(false);
    //   }
    // })
  }

  loadArrays() {
    // this.service.getDistinctArray("process", "content_type").subscribe((data: any) => {
    //   this.content_type_list = data;
    // })

    // this.service.getDistinctArray("brand", "brand_name").subscribe((data: any) => {
    //   this.brands = data;
    // })
  }

  addBounty() {

    var selectedSteps = [];
    for (var i = 0; i < this.selected_steps.length; i++) {
      if (this.selected_steps[i] == true) {
        selectedSteps.push(this.editorial_process[i])
      }
    }

    var bounty = {
      "brand_name": this.brand_name,
      "release_for_bounty": moment(this.release_for_bounty).format(),
      "queued_content": this.content_description,
      "m_b": parseInt(this.budget),
      "spend": 0,
      "c_b": 0,
      "creator": "None",
      "creatorId": "",
      "pipeline": "Unclaimed",
      "published": false,
      "keywords": [],
      "steps": selectedSteps
    }

    this.service.addDataToSourceForm(bounty).subscribe((data: any) => {
      console.log(137, data);
      this.refreshTable()
    })
    this.hideHeaderButtonArea();

  }

  // Re Task
  // Keyword and Prompt Bucket
  keywordInput: any = "test"
  emailLists: any = [ ];
  addEmail(keyWord: string) {
    this.emailLists = keyWord.split("\n").concat(this.emailLists);
    this.keywordInput = null
  }

  deleteEmail(email: string) {
    const index: number = this.emailLists.indexOf(email);
    if (index !== -1) {
      this.emailLists.splice(index, 1)
    }
  }

  deleteTitle(title: string) {
    const index: number = this.titleList.indexOf(title);
    if (index !== -1) {
      this.titleList.splice(index, 1)
    }
  }

  // Keyword and Prompt Bucket end


  //Google Autocomplete
  searchData: any = [

  ]

  userData: any[] = this.searchData;
  userList1: any;

  getUserIdsFirstWay($event) {
    let userId: any = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
    this.userList1 = [];
    if (userId.length > 0) {
      this.userList1 = this.searchFromArray(this.userData, userId);
    } else {
      this.AutocompleteShow = true;
      this.AutocompleteShowAfterSearch = false;
    }
  }

  searchFromArray(arr, regex) {
    let matches: any = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
        this.AutocompleteShow = false;
        this.AutocompleteShowAfterSearch = true;
      } else {
        this.AutocompleteShow = true;
        this.AutocompleteShowAfterSearch = false;
      }
    }
    return matches;
  };

  AutocompleteShow = true;
  AutocompleteShowAfterSearch = false;
  g_autocomplete_val: any
  selectItem(data: any) {
    this.g_autocomplete_val = data;
    this.AutocompleteShow = true;
    this.AutocompleteShowAfterSearch = false;
  }

  cleareInput() {
    this.g_autocomplete_val = ""
    this.AutocompleteShow = true;
    this.AutocompleteShowAfterSearch = false;
  }
  //Google Autocomplete end

  //Add Prompts
  beforePrompt = true;
  afterPrompt = false;
  promptInput: any
  promptsList: any = [];

  titleInput: any
  titleList: any = [];

  addToBucket(list, listName, text, model){
    list = text.split("\n").concat(list);
    //list.reverse();
    this[listName] = list;
    this[model] = ""
  }

  deleteFromBucket(){

  }

  addPrompt(prompts: string) {
    if (prompts) {
      this.promptsList.push(prompts);
      this.promptInput = null;
      if (this.promptsList === null || this.promptsList === '') {
        this.beforePrompt = true;
        this.afterPrompt = false;
      } else {
        this.beforePrompt = false;
        this.afterPrompt = true;
      }
    }
  }

  deletePrompt(prompt: string) {
    const index: number = this.promptsList.indexOf(prompt);
    if (index !== -1) {
      this.promptsList.splice(index, 1)
    }
    if (index === 0 || index === null) {
      this.beforePrompt = true;
    }
  }

  //Add Prompts end
  drop(event: CdkDragDrop<string[]>) {
    console.log("drop");
    this.sharedService.drop(event);
  }

  dragStart(ev, dragType, data) {
    ev.target.id = "taskid";
    if(dragType == 'add_keyword'){
      this.dragFrom = "keywords"
    }
    if(dragType == 'add_title'){
      this.dragFrom = "titles"
    }
    if(dragType == 'add_prompt'){
      this.dragFrom = "prompts"
    }
    var dropOriginData = {
      dragType: dragType,
      droppedData: data
    }
    
    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("dropOriginData", JSON.stringify(dropOriginData));
  }

  dropItemReceived($event: any) {
     console.log(340, "dropItemReceived", $event.dragType);

     var _id = $event["_id"];
     if($event.dragType == "add_keyword"){
       console.log(344, "add_keyword");
       this.pushValueIntoArray(_id, "keywords", $event["droppedData"], true);
       const index = this.emailLists.indexOf($event["droppedData"]);
        if (index > -1) {
           this.emailLists.splice(index, 1);
        }
      var brand_id = "";

      for(var i = 0; i < this.brands.length; i++){
        if(this.brands[i]["brand_name"] == this.lastBrandSelected)
          brand_id = this.brands[i]["_id"];
      }

      console.log(382, "calling dynamicButton", "keyword", _id, "deploykeyword", {"keyword":$event["droppedData"],"brand_name":this.lastBrandSelected, "brand_id":brand_id})
      this.service.dynamicButton("keyword", _id, "deploykeyword", {"keyword":$event["droppedData"],"brand_name":this.lastBrandSelected, "brand_id":brand_id}).subscribe(
          (data: any) => {
            console.log(373, data)
            // Display a popup here of the button results
            //data.actions["_id"] = _id;
            //data.actions["key"] = "keyword";
            //data.actions["button"] = "deploykeyword";
            //data.actions["row"] = 0;
           
          }
        )
        // I need Keyword, brand_name and created_by
        console.log(371, $event)
      // this.service.addDataById(
      // { 
      //   bounty: _id, 
      //   bKeywordDeployed: true
      // }).subscribe(
      //   (data: any) => {   
      //     console.log(381, data)                      
      // })

     }

     if($event.dragType == "add_title"){
       this.pushValueIntoArray(_id, "titles", $event["droppedData"], true);
       const index = this.titleList.indexOf($event["droppedData"]);
        if (index > -1) {
           this.titleList.splice(index, 1);
        }
     }

     if($event.dragType == "add_prompt"){
       this.pushValueIntoArray(_id, "prompts", $event["droppedData"], true);
       const index = this.promptsList.indexOf($event["droppedData"]);
        if (index > -1) {
           this.promptsList.splice(index, 1);
        }
     }

    // var keys = Object.keys($event);
    // 
  }

  flextableHeaderButtonClicked(event) {

    if (event == "Add Bounty") {
      this.router.navigate(['/bounties'])
    } else {
      super.flextableHeaderButtonClicked(event);
    }
  }

  // bDisplay = false
  dragEnter(from) {
    // console.log(345, from);
    // if(from == 13){
    //   this.bDisplay = true;
    //}
  }

  dragMoved(from, $event) {
    //if(!this.bDisplay)
    //   return;
    // console.log(345, from, $event);
  }

  dragFrom: string = "";

  onDragStart(e){
    console.log(399, "onDragStart");
  }

  onDragEnd(e){
    console.log(403, "onDragEnd");
    this.dragFrom = "";
  }

  onDragEnter(e){
    //console.log(407, "onDragEnter");
  }
  
  onDragLeave(e){
    console.log(411, "onDragLeave");
  }
  
  onDragOver(e){
    if(this.dragFrom == e.key){
      e.event.preventDefault();  
    }
  }
  
  onDropEvent(e){
    //e.preventDefault();
    console.log(419, "onDropEvent");
  }
  
  lastBrandSelected = "";
  // Added Wed Mar 10 2021

  compoundFilter = { }

  content_type = "";
  pipeline = "";
  status = "";
  brand_id;


  headerDropdownChanged($event){

    console.log("Header Dropdown called", $event)

    console.log(447, "A header button changed", $event.value, $event);
    var filter = $event;
    var brand_name = "";

    if($event.label == "Content Type"){
      this.content_type = $event.value;
    }

    if($event.label == "Pipeline"){
          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.filtersObj);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$eq": "unclaimed" }, "name":$event.value, "bStatus":true }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
              process["$elemMatch"]["name"] = this.pipeline
            else
            {
              console.log(528, this.flexTable.filtersObj[2].filter)
              this.flexTable.filtersObj[2].filter = false;
              return;
            }
          }

            delete this.flexTable.filtersObj[2].filter.pipeline
            this.flexTable.filtersObj[2].filter = 
            {
                process: process
            }

            delete this.flexTable.filtersObj[2].filter.pipeline
            this.flexTable.filtersObj[2].key = ""
            console.log(538, this.flexTable.filtersObj[2].filter.pipeline)
            return;
    }



    if($event.label == "Brand"){
      var brand_id = 0;
      brand_name = $event.value;
      console.log(483, this.brands);
      for(var i = 0; i < this.brands.length; i++){
        if(this.brands[i]["brand_name"] == brand_name)
          brand_id = this.brands[i]["_id"];
          this.brand_id = brand_id;
      }

       var keywordFilter = {
          "filter":{
              "brand_id":brand_id,
              "bKeywordDeployed": {$ne: true}
          }
        }
        this.lastBrandSelected = $event.value;
       console.log(470, keywordFilter);
       this.service.getDistinctArrayWithFilter("keywords", "Keyword", keywordFilter).subscribe((data: any) => {
         console.log(457, data);
         this.emailLists = data
       })

      } else {
      // Do nothing as we don't want to respond to these buttons being clicked...yet
    }

  console.log(676, $event.value);

    if($event.label == "Status"){

      console.log(547, $event.label, $event.value);

      if($event.value == "Status"){
        this.flexTable.filtersObj[3].filter = false;
        this.flexTable.filter = "";
        this.flexTable.getInitialDataTableList(250)
        return;
      }
      console.log("Find Unclaimed Bounties")
      console.log(526, $event.value)

      if($event.value == "Claimed, in Progress"){
          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$ne": "unclaimed" }, "bStatus":false, "status":"incomplete" }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
              process["$elemMatch"]["name"] = this.pipeline
            else
            {
              this.flexTable.filtersObj[3].filter = false;
              return;
            }
          }

            this.flexTable.filtersObj[3].filter = 
            {
                process: process
            }

      }

      if($event.value == "Unclaimed"){

          const now = new Date();

          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$eq": "unclaimed" }, "bStatus":true, "status":"incomplete", "completion_order":1 }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
            process["$elemMatch"]["name"] = this.pipeline
          else
            {
              this.flexTable.filtersObj[3].filter = false;
              return;
            }
          }

            this.flexTable.filtersObj[3].filter = 
            {
                "release_for_bounty": { "$lte": now.toISOString() },
                process: process
            }
      }

      if($event.value == "Selected"){
        this.flexTable.filtersObj[3].filter = false;
        this.flexTable.filter = `{ "selected":true }`;
        this.flexTable.getInitialDataTableList(250)
        return;
      }

      if($event.value == "Started, Current Step Unclaimed"){

          const now = new Date();

          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$eq": "unclaimed" }, "bStatus":true, "status":"incomplete", "completion_order": {"$gt": 1 } }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
            process["$elemMatch"]["name"] = this.pipeline
          else
            {
              this.flexTable.filtersObj[3].filter = false;
              return;
            }
          }

            this.flexTable.filtersObj[3].filter = 
            {
                "release_for_bounty": { "$lte": now.toISOString() },
                process: process
            }        

      }

      if($event.value == "Claimed, Step In Progress"){
          const now = new Date();

          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$ne": "unclaimed" }, "bStatus":false, "status":"incomplete" }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
            process["$elemMatch"]["name"] = this.pipeline
          else
            {
              this.flexTable.filtersObj[3].filter = false;
              return;
            }
          }

            this.flexTable.filtersObj[3].filter = 
            {
                "release_for_bounty": { "$lte": now.toISOString() },
                process: process
            }        
      }

      if($event.value == "Released"){

          const now = new Date();

          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          this.flexTable.filtersObj[3].filter = 
          {
              "release_for_bounty": { "$lte": now.toISOString() }, "pipeline": {"$eq": "unclaimed" }
          }        
      }

      if($event.value == "Claimed, Completed"){
                  delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$ne": "unclaimed" }, "bStatus":false, "status":"complete" }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
              process["$elemMatch"]["name"] = this.pipeline
            else
            {
              this.flexTable.filtersObj[3].filter = false;
              return;
            }
          }

            this.flexTable.filtersObj[3].filter = 
            {
                process: process,
                "pipeline":"Completed"
            }
      }

      console.log(676, $event.value);

      /*
            var desiredPipeline = $event.value;

          delete this.flexTable.combinedFilter["pipeline"];
          console.log(554, this.flexTable.combinedFilter);

          var process = {}
          process["$elemMatch"] = { "pipeline": { "$eq": desiredPipeline }, "bStatus":true, "status":"incomplete" }
          if(this.pipeline != ""){
            if($event.label != "Pipeline")
            process["$elemMatch"]["name"] = this.pipeline
          else
            {
              this.flexTable.filtersObj[3].filter = false;
              return;
            }
          }

            this.flexTable.filtersObj[3].filter = 
            {
                  process: process
            }
            */
      // Claimed, in Progress
      // db.bounties.find({"brand_name":"Top 40 Weekly", process: { "$elemMatch": { "pipeline": { "$ne": "unclaimed" }, "name": "Publication", "bStatus":false, "status":"incomplete" } } }).count()

      // Claimed, Completed
      // db.bounties.find({"brand_name":"Top 40 Weekly", process: { "$elemMatch": { "pipeline": { "$ne": "unclaimed" }, "name": "Publication", "bStatus":false, "status":"complete" } } })

      // Waiting to be Claimed
      //db.bounties.find({"brand_name":"Top 40 Weekly", process: { "$elemMatch": { "pipeline": { "$eq": "unclaimed" }, "name": "Publication", "bStatus":true, "status":"incomplete" } } }).pretty()


    //}
      //   this.flexTable.aggregate = `[ 
      //   { "$lookup": { "from": "bounties", "localField":"bounty_id","foreignField":"_id", "as": "bounty" } },
      //   { "$match" : { "brand_id": "${this.sharedService._variableData._id }", "bKeywordDeployed": true, "bounty.published_link": { "$exists": false } } }, 
      //   {"$unwind":"$bounty"},
      //   { $replaceRoot: { newRoot: { 
      //     "_id":"$_id",
      //     "selected":"$selected",
      //     "Keyword":"$Keyword",
      //     "content_type":"$bounty.content_type",
      //     "prompt":"$Prompt",
      //     "title":"$Title",
      //     "published_link ": "$bounty.published_link" 
      //   } } } 
      // ]`
      //   this.filter = '';
      //  this.flexTable.getInitialDataTableList();
     }

     console.log("Header Dropdown returned", this.pipeline)
  }

  dateChanged($event){
    console.log(493, $event);
    var key = $event.key;
    var _id = $event._id;
    var date = $event.date

    this.service.postAction(key, "updatebountyboxfoldername", {_id: _id, newFolderName: date}).subscribe(
            (data: any) => {
              console.log(1972, data);
            });
  }



  tableButtonClicked($event){
    console.log(505, $event);
    
    if($event.button == "Files"){

     // var test = "test-1";
     // var testA = voca.kebabCase(test);

     // console.log(124, $event);

      return super.tableButtonClicked($event)
    }

    if($event.button == "Template"){
      window.open($event.templateFolderSharedLink);
    }

    if($event.button == "Details"){

      this.response = $event;
      console.log(832, this.response);
      this.sharedService._id = $event.bounty._id;
      this.sharedService.referringPage = this.flexTable.service.datasourceUrl
      this.sharedService.xbody = this.flexTable.columns
      console.log(688, this.flexTable.columns)
      this.sharedService._variableData = $event.bounty;
      
      return super.tableButtonClicked($event);


      // this.sharedService._id = $event.bounty._id;
      // this.sharedService.referringPage = this.flexTable.service.datasourceUrl
      // this.sharedService.xbody = this.flexTable.columns
      // console.log(688, this.flexTable.columns)
      // this.sharedService._variableData = $event.bounty;
      // this.router.navigate(['bounty-detail']) 


      return;
    }

    // if($event.button == "Files"){
    //   window.open($event.bountyFolderSharedLink);
    // }
    
    return super.tableButtonClicked($event);  
  }

  dropdownItemDeleted($event){
    if($event.key == "keywords"){
      // We will receive an object that looks like this:
      /*
        {id: "608551d92c0c516d13441964", key: "keywords", value: "Monahons"}

        In this case, id is the _id of the bounty_document, and can be referenced in the keywords collection by "bounty_id"

        so our search query would be: 
        var query = {"bounty_id":$event.id, "Keyword":$event.value}
      */
          
          this.service.postAction("keywords", "releasekeyword", {bounty_id: $event.id, keyword: $event.value}).subscribe(
            (data: any) => {
              console.log(1972, data);
            });
          
    }

  }

  bSelectAll = false;

  buttonClicked(buttonName: string){

    console.log(724, buttonName);

    if(buttonName == "Undeploy Keywords"){
        // archive the bounties
        console.log(562, "Archive Bounties")
        return;
    }

    if(buttonName == "Open Scripts"){
        // archive the bounties
      this.service.postAction("bounties", "getselectedscripts").subscribe(
            (data: any) => {
              console.log(1972, data);

              for(var docId of data.actions.bounty_documents){
                var url = `https://docs.google.com/document/d/${docId}/edit`;
                window.open(url, "_blank");
              }
            });
            // Activate the bulk edit screen
            return false;
        return;
    }

    if(buttonName == "Open Docs"){
        // archive the bounties
      this.service.postAction("bounties", "getselecteddocs").subscribe(
            (data: any) => {
              console.log(1972, data);

              for(var docId of data.actions.bounty_documents){
                var url = `https://docs.google.com/document/d/${docId}/edit`;
                window.open(url, "_blank");
              }
            });
            // Activate the bulk edit screen
            return false;
        return;
    }

    if(buttonName == "Open Sheets"){
        // archive the bounties

        return;
    }

    if(buttonName == "Edit Bulk"){
            // archive the bounties
            console.log(562, "Edit Bulk")

      this.service.postAction("bounties", "bulkedit", {brand_id: this.brand_id, content_type: this.content_type}).subscribe(
            (data: any) => {
              console.log(1972, data);
            });
            // Activate the bulk edit screen
            return false;
    }

    if(buttonName == "Select All"){
            // archive the bounties
            console.log(562, "Edit Bulk")
            this.bSelectAll = !this.bSelectAll
            return;
    }

    if(buttonName == "Archive"){
        // archive the bounties
        console.log(562, "Archive Bounties")
        return;
    }

    super.buttonClicked(buttonName);

    return true;
  }


}
