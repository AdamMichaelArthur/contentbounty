import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import {Router} from '@angular/router';
import { SearchBountyService } from './search-bounty.service';
import { BaseComponent } from '../base/base.component';
import { FlexibleTableService } from "../flexible-table/services/flexible-table-service"
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, take, catchError } from 'rxjs/operators';
import * as moment from 'moment';
import * as socketIo from 'socket.io-client';
import voca from 'voca';

@Component({
  selector: 'app-search-bounty',
  templateUrl: './search-bounty.component.html',
  styleUrls: ['./search-bounty.component.css']
})

export class SearchBountyComponent extends BaseComponent implements OnInit, OnDestroy {

  skills = ""

    disableDropdown = false;
    
    keywords = [];

  private socket;
  public SERVER_URL = environment.websocketBase;

  refreshTable() {
    console.log("Refreshing FlexTable");
    this.flexTable.getInitialDataTableList()
  }

  tableButtonClicked($event){
    console.log(27, "tableButtonClicked", $event);
    this.refreshTable()

    if($event.button == "Claim"){
      if($event.result == 2){
        alert($event.msg);
        return;
      }
      if($event.result == true){
        return;
      }

      return;
    }
    
    if($event.button == "Template"){
      return super.tableButtonClicked($event);
    }
    
    //     if($event.button == "Files"){


    //   console.log(124, $event);
    //   this.bountySpreadsheet = $event.bountySpreadsheet
    //   this.bountyDocument = $event.bountyDocument

    //   if(typeof $event.docs != 'undefined'){
    //     for(var doc of $event.docs){
    //       doc.filename = voca.replaceAll(doc.filename, "_", " ");
    //       doc.filename = voca.replaceAll(doc.filename, "-", " ");
    //       doc.filename = voca.titleCase(doc.filename);
    //       doc.filename = voca.replaceAll(doc.filename, ".Docx", " / docx - Document")
    //       doc.filename = voca.replaceAll(doc.filename, ".Xlsx", " / xlsx - Spreadsheet")
    //     }
    //     this.googleDocs = $event.docs;
    //     console.log(66, this.googleDocs)
    //             this.keywords = []
    //     for(var keyword of $event.keywords){
    //       keyword = voca.titleCase(keyword);
    //       console.log(128,keyword)
    //       this.keywords.push(keyword)
    //     }
    //   }

    //   if(typeof $event.code_generator_url != 'undefined'){
    //     this.code_generator_available = true;
    //   }

    //   return super.tableButtonClicked($event)
    // }

          if($event.button == "Kickback"){

        console.log(135, "Kickback Clicked");
        this.processSteps = $event.bounty.prevSteps;
        //this.currentStep = 1;
        console.log(94, $event.bounty)

        this.tableButtonSubviews[2] = true;
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
    
    return super.tableButtonClicked($event)
    
    //super.tableButtonClicked($event);
    
    //super.tableButtonClicked($event);
  }

  isoDateString = new Date().toISOString()
  
    filters = [
    {
      "filter": { "brand_name": "" },
      "label": "Brand",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",
      "all":true
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

  //  This prevents someone from claiming multiple steps in a bounty chain.  I need to put some more
  //  thought into if this is behavior I actually want or not.  For now ( Thu Aug 12 2021 ) it's causing
  //  issues and is being temporarily removed.  Place the line in the 2nd line for aggregateStr

  //  { '$match': { "process.pipeline": { '$ne': $res.locals.user._id } } }, 
  aggregateStr = `[
      { "$match" : { "release_for_bounty": { "$lte": "${this.isoDateString}" } } },
      { "$match" : { "pause": { "$ne": true } } },
      { $project:{
          brand_name:1,
          content_type:1,
          pipeline:1,
          keywords:1,
          prompts:1,
          process:1
      }},
      {"$unwind":"$process"},
      {"$match":
        { "$and":
          [  
            {"process.bStatus": true},
            {"process.pipeline":"unclaimed"},
            {"process.checkin":{ $eq: false } },
            {"process.inhouse":{ $eq: false } },
            {"process.skills":
              { "$in": $res.locals.user.skill} 
            },
          ]
        }
      },
      { $project:{

          brand_name:1,  
          content_type:1,
          bounty:"$process.bounty",
          refDocId:"$process.refDocId",
          name:"$process.name",
          description:"$process.description",
          pipeline:1,
          keywords:1,
          prompts:1,
          completion_order:"$process.completion_order"
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
                        name:"$name",
                        keywords:"$keywords",
                        prompts:"$prompts",
                        bounty:"$bounty",
                        description:"$description",
                        completion_order:"$completion_order",
                        refDocId:"$refDocId"

                      } 
                    ] 
                } 
          }
      }
  ]`

  constructor( private router: Router, public searchBountyService:SearchBountyService, 
    public service: BaseService, public elementRef: ElementRef,
    public flexibleTableService: FlexibleTableService) 
  {
    super(service, elementRef) 
  }

  ngOnInit() {
    //this.aggregateStr = this.aggregateStr.replace("{{isoDateString}}", this.isoDateString);

    // We want to pare down our filters...

    super.ngOnInit()
  }


  textCutoff = [16, 18, 20]

  viewMinutes: any = []

  test(row, body, api_url){
      this.service.http.post(api_url, body, this.service.httpOptions).subscribe(response => {
          this.updateBountyPrice(row, response['actions'].firstViewDate)
          console.log(164, row, response);
          this.viewMinutes.push({... row, minutes: response['actions'].firstViewDate })
            setInterval(function(self, row, firstViewDate){
                self.updateBountyPrice(row, firstViewDate)
            }, 4000, this, row, response['actions'].firstViewDate)
        })
  }

updateBountyPrice(row, firstViewDate){

    for(var i = 0; i < this.viewMinutes.length; i++){

      if(row.id == this.viewMinutes[i].id){
        //console.log(178, this.viewMinutes[i])
        var secondsElapsed = moment().unix() - this.lastCall
        //console.log(183, secondsElapsed)
        this.viewMinutes[i].minutes += (secondsElapsed / 60)
        
        var incPrice = String( (this.viewMinutes[i].minutes * .01).toFixed(2) )
        this.flexTable.updateField(row._id, "Bounty", "$" + incPrice)
      }
    }
    this.lastCall = moment().unix()
    //this.firstMoment = moment().unix()  
  }

  firstMoment: any
  lastCall: any


  receivedTableData($event){
    // this.firstMoment = moment().unix()

    // for(var i = 0; i < $event.length; i++){
    //   var row =  $event[i];
    //    this.flexTable.updateField(row._id, "Bounty", '...')
    //    var api_url = this.service.baseUrl + '/actions/datasource/track/action/trackBounty'

    // var body = {
    //   "refDocId" : row.refDocId
    // }

    // this.test(row, body, api_url)
    // }

    
    
  }

  headerDropdownChanged($event){
    console.log(146, "A header button changed", $event, $event.value);
    
    if($event.label == "Pipeline"){
          // delete this.flexTable.combinedFilter["pipeline"];
          // console.log(554, this.flexTable.filtersObj);

          var Test = { "process": { "$elemMatch":  { "pipeline": { "$eq": $event.value }, "bStatus":true } } }
          
          //this.flexTable.aggregate = this.aggregateStr
          //console.log(237, Test);

          // if(this.flexTable.filtersObj[2].filter.pipeline == ""){
          //   if($event.label != "Pipeline")
          //     process["$elemMatch"]["name"] = this.pipeline
          //   else
          //   {
          //     console.log(528, this.flexTable.filtersObj[2].filter)
          //     this.flexTable.filtersObj[2].filter = false;
          //     return;
          //   }
          // }

          //   delete this.flexTable.filtersObj[2].filter.pipeline
          //   this.flexTable.filtersObj[2].filter = 
          //   {
          //       process: process
          //   }
          //console.log(256, process);

            //delete this.flexTable.combinedFilter["pipeline"];

                             this.flexTable.filtersObj[2].filter = { }
                             this.flexTable.filtersObj[2].key = ""
                             //this.flexTable.filtersObj[2].filter.pipeline = process
            //var aggregateObj = JSON.parse(this.aggregateStr);
            //console.log(263, aggregateObj);

            this.flexTable.aggregateStrOrig = "";
            this.flexTable.aggregate =  this.aggregateStr.replace(`{"process.pipeline":"unclaimed"},`, `{"process.pipeline":"unclaimed"},\n{"process.name":"${$event.value}"},`)
            console.log(538, this.flexTable.aggregateStrOrig.length, this.flexTable.aggregate)
            return;
    }

    // if($event.label == "Content Type"){
    //   this.currentContentType = $event.value;
    //   return;
    // }

    // this.currentBrand = $event.value;

    // console.log(311, $event.value);

    // if(this.currentBrand == ""){
    //     alert("Please Select A Brand First");
    //     return;
    //   }

    // for(var i = 0; i < this.brands.length; i++){
    //     if(this.brands[i].brand_name == this.currentBrand){
    //         this.currentBrandId = this.brands[i]["_id"]
    // }
    // }

  }
  
  ngOnDestroy(){

  }
  //Popup Function
  viewDetailsBountyPopup = false;
  bounty_details:any

  viewDetailsBounty(bounty){
    this.viewDetailsBountyPopup = !this.viewDetailsBountyPopup
    this.bounty_details = bounty;
    console.log(bounty)
  }

  viewDetailsBounty2(){
    this.viewDetailsBountyPopup = false;
  }
  //Popup Function end

  //Search Function
  searchAll = false;
  searchCheck = true;
  searchText:any;
  somethingChanged(newval:any){
    if(newval.length > 0){
      this.searchAll = true;
      this.searchCheck = false;
    }else{
      this.searchCheck = true;
      this.searchAll = false;
    }
  }

  catogary_name:string;
  get selectedBountyTypes() {
    return this.bounty_catogarys.reduce((aas, a) => {
      if (a.selected) {
        aas.push(a.catogary_name);
      }
      return aas;
    }, [])
  }
  //Search Function

  //Claim Bounty Functionality
  claimBounty(bountyId:any){

    console.log(212, bountyId.id)
    const index: number = this.bountys.indexOf(bountyId);
    if(index !== -1){
        this.bountys.splice(index, 1)
    }
    let cart: any = [];
    cart.push(bountyId);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.router.navigate(["/submit_bounty"]);

    this.searchBountyService.submitCreatorsBounty(bountyId).subscribe((data:any)=>{
      console.log(data);
      console.log("Bounty Added Successfully")

      this.refreshTable()
    }, error=>{
      console.log(277, error)
    })
  }

	items: any = [];
  ifUncompletedBounty = false
  loadBounty(){
		// this.items = JSON.parse(localStorage.getItem('cart'));
  //   if(this.items.length < 1){
  //     //alert("0+++")
  //     this.ifUncompletedBounty = false
  //   }else{
  //     //alert("0-----")
  //     this.ifUncompletedBounty = true
  //   }
  //   console.log(this.items.length)

  }
  //Claim Bounty Functionality End

  // Get Bounty	
  bountys: any = [];
  getBounty(){
    this.searchBountyService.getBounty().subscribe((data:any)=>{
      this.bountys = data.imran;
      console.log(this.bountys);
    },error=>{
      console.log(error)
    })

  }
  // Get Bounty End

  //Dummy Data
  bounty_catogarys:any = [
      {
        label:"Content Writer",
        catogary_name:"content_writer",
        selected: false
      },
      {
        label:"SEO Expart",
        catogary_name:"SEO",
        selected: false
      },
      {
        label:"UI Designer",
        catogary_name:"ui_designer",
        selected: false
      },
      {
        label:"Video Animator",
        catogary_name:"video_animator",
        selected: false
      },
      {
        label:"Content Checker",
        catogary_name:"content_checker",
        selected: false
      }
    ];


  //Dummy Data End
}
