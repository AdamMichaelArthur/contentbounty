
import { BaseService } from "../base/base.service";
import { BaseComponent } from "../base/base.component";
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedService } from "../../_services/shared.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { FlexibleComponent } from "../flexible-table/flexible-table.component";

@Component({
  selector: "app-content-planner",
  templateUrl: "./content-planner.component.html",
  styleUrls: ["./content-planner.component.css"],
})
export class ContentPlannerComponent extends BaseComponent implements OnInit {
  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef);
  }


  pagination: any = {} 

  /* Variable Declarations */
  reasons: any = [
      "Topical Relevancy",
      "Affiliate Revenue",
      "Link-to Content",
      "Informational Content"
    ];

  ngOnInit(): void {
    this.display_count = Array(100)
      .fill(0)
      .map((x, i) => i + 1);
    console.log(this.display_count);
    this.getContentTypes();
    this.getBrands();
    this.getPlatforms();

    // This is bad code.  Yes I know.  I'm fucking tired ok and I just need it to work 
    for(var i = 0; i < 10000; i++){
      this.processPopup[i] = false
    }
    //this.loadIteams()

    this.getSavedContentPlan()
  }

  getSavedContentPlan(){
    this.service
      .getAnyList("content_plan", 100, null, { deployed: {$ne: true } } )
        .subscribe((data: any) => {
          console.log(54, data);
          if(data.Error != 0){
            console.log(61, data)
            // No content plan saved...do nothing
            return;
          }
          console.log(60, data)
          this.testIteams = data.content_plan
          this.pagination = data.pagination
          
        });    
  }

  deployed_urls = [];
  getDeployedBounties() {
    console.log(32, this.selected_brand_id);
    this.service
      .getDistinctArrayWithFilter("bounties", "published_link", {
        published_link: { $exists: true },
        brand_id: this.selected_brand_id,
      })
      .subscribe((data: any) => {
        console.log(33, data);
        this.deployed_urls = data;
      });
  }

  brands = [];
  getBrands() {
    this.service
      .getDistinctArrayWithIds("brands", "brand_name", false)
      .subscribe((data: any) => {
        this.brands = data;
        console.log(32, this.brands);
      });
  }

  platforms = [];
  getPlatforms() {
    this.service
      .getDistinctArray("platforms", "platform")
      .subscribe((data: any) => {
        console.log(39, data);
        this.platforms = data;
      });
  }

  getContentTypes() {
    this.service
      .getDistinctArrayWithIds("brands", "brand_name", false)
      .subscribe((data: any) => {
        this.brands = data;
        console.log(32, this.brands);
      });

    this.service
      .getDistinctArray("processes", "content_type")
      .subscribe((data: any) => {
        this.content_type = data;
        console.log(32, data);
      });
  }

  getSupportedPlatforms() {}

  unused_keywords = [];

  getUnusedKeywords() {
    console.log(45, this.selected_brand_id);
    this.service
      .getArray(
        "keywords",
        { brand_id: this.selected_brand_id, bKeywordDeployed: { $ne: true } },
        true,
        100
      )
      .subscribe((data: any) => {
        console.log(46, data);
        this.unused_keywords = data;
        this.getDeployedBounties();
      });
  }

  target_platform: any = [
    "Blog",
    "Website",
    "Instagram",
    "LinkedIn",
    "YouTube",
    "Facebook",
  ];

  selected_platform: any = "";
  selectTargetPlatform(event) {

    this.selected_platform = event.target.value;

    this.filterByPlatform(event.target.value)
  }

  filterByPlatform(platform){
    this.service
      .getAnyList("content_plan", 100, null, { deployed: { $ne: true } } )
        .subscribe((data: any) => {
          console.log(54, data);
          if(data.Error != 0){
            return;
          }

          this.testIteams = data.content_plan


          //console.log(162, event.target.value)
          if(platform == ""){
            return;
          } else {
          top:
          while(true){
          for(var i = 0; i < this.testIteams.length; i++){
            console.log(166)
              if(this.testIteams[i].target_platform != platform){
                console.log(170)
                this.testIteams.splice(i, 1)
                continue top;
            }
          }
          break;
          }
        }
    }); 
  }

  selected_brand: any = "";
  selected_brand_id: any = "";
  selectTargetBrand(event) {
    console.log(60, event.target.value);
    this.selected_brand = event.target.value;
    for (var i = 0; i < this.brands.length; i++) {
      if (this.brands[i].brand_name == event.target.value) {
        this.selected_brand_id = this.brands[i]._id;
        this.getUnusedKeywords();
      }
    }
  }

  content_type: any = [];
  selected_content: any = "";
  selectContentType(event) {
    console.log(196, event.target.value);
    this.selected_content = event.target.value;
    this.filterByContentType(this.selected_content)

  }

  filterByContentType(platform){

    console.log(214, platform);

    this.service
      .getAnyList("content_plan", 1000, null, { deployed: {$ne: true } })
        .subscribe((data: any) => {
          console.log(54, data);
          if(data.Error != 0){
            return;
          }

          this.testIteams = data.content_plan


          //console.log(162, event.target.value)
          if(platform == ""){
            return;
          } else {
          top:
          while(true){
          for(var i = 0; i < this.testIteams.length; i++){

              if(this.testIteams[i].content_type != platform){
                this.testIteams.splice(i, 1)
                continue top;
            }
          }
          break;
          }
        }
    }); 
  }
  display_count: any = [];
  row_number: number = 0;
  selectDisplayRow(event) {
    this.row_number = event.target.value;
  }

  selected_number: any = [];
  addContent() {

    var bulkUpdate = [];

    if (this.selected_platform && this.row_number) {
      for (let i = 0; i < this.row_number; i++) {
        console.log(164, i)
        // this.selected_number.push({
        //   selected_platform: this.selected_platform,
        //   selected_content: this.selected_content,
        //   unused_keyword: "",
        //   brand_name:this.selected_brand,
        //   brand_id:"",
        //   unused_keyword_id: "",
        //   title:"",
        //   prompt:"",
        //   secondary_keywords:[],
        //   internal_links:[],
        //   reasons:[],
        //   affiliate_links:[],
        //   content_type:"",
        //   target_platform:"",
        //   count: i,
        // });

      //let cart: any = JSON.parse(localStorage.getItem('selected_number'));
      var item = {
          selected_platform: this.selected_platform,
          selected_content: this.selected_content,
          unused_keyword: "",
          unused_keyword_id: "",
          brand_name:this.selected_brand,
          brand_id:"",
          title:"",
          prompt:"",
          secondary_keywords:[],
          internal_links:[],
          reasons:[],
          affiliate_links:[],
          content_type:this.selected_content,
          target_platform:this.selected_platform,
          count: i,
        };

      //cart.push(item)
      //localStorage.setItem('selected_number', JSON.stringify(cart));

        bulkUpdate.push(item);
      }

    } else {
      if (this.selected_platform == "") {
        alert("Please select your target platform");
      } else {
          if (this.row_number == 0) {
            alert("Content planner not will be 0");
          }
      }
    }

    this.service
      .bulkInsertNewData("content_plan", bulkUpdate)
        .subscribe((data: any) => {
          console.log(270)
          //this.testIteams = this.testIteams.concat(data.content_plan)
          //this.filterByPlatform(this.selected_platform)
          this.getSavedContentPlan()
      });    

    
  }

  // This is used to save an item that already exists
  saveDataLocally(pos, key, value, isArray =false){

//    this.secondary_keywords.push(value.target.value);

    var item = this.testIteams[pos]
    if(typeof item == 'undefined'){
      console.log(249, pos, key, value, isArray)
      return;
    }

    if(typeof item["_id"] == 'undefined'){
      // There is a problem here -- we should have this defined.  This might be a new item entirely
      // In which case we can to the database differently.console
      return;
    }

    item[key] = value;

    console.log(342, item);

    this.service
      .updateAnyDataById("content_plan", item, item["_id"])
        .subscribe((data: any) => {
          console.log(262, data);
          if(data.Error != 0){
            // No content plan saved...do nothing
            return;
          }
          //this.testIteams = data.content_plan
        });    
    
    //console.log(260, item);
      // console.log(209, pos, key, value, this.testIteams[pos])

      // var cart: any = JSON.parse(localStorage.getItem('selected_number'));

      // if string
      // if(!isArray){
      //   this.testIteams[pos][key] = value;  
      // } else {
      //   console.log(225, cart[pos])
      //   //cart[pos][key].push(value);
      // }
      
      // // if array then push

      // localStorage.setItem('selected_number', JSON.stringify(cart));

      // if(key == "unused_keyword")
      //   this.testIteams = cart;

      // console.log(220, cart);

  }

  deployUnusedKeywords() {
    for (let i = 0; i < this.unused_keywords.length; i++) {
      this.selected_number.push({
        selected_platform: this.selected_platform,
        selected_content: this.selected_content,
        unused_keyword: this.unused_keywords[i].Keyword,
        unused_keyword_id: this.unused_keywords[i]._id,
        count: i,
      });
    }
    if (localStorage.getItem('selected_number') == null) {
      let cart: any = [];
      cart.push(...this.selected_number);
      localStorage.setItem('selected_number', JSON.stringify(cart));
    } else {
      let cart: any = JSON.parse(localStorage.getItem('selected_number'));
      cart.push(...this.selected_number);
      localStorage.setItem('selected_number', JSON.stringify(cart));
    };
    console.log(this.selected_number);
    this.loadIteams()
  }

  testIteams:any[]=[]
  loadIteams(){ 
    console.log(356)
    this.testIteams = JSON.parse(localStorage.getItem('selected_number'));
    console.log(this.testIteams)
  }

  remove(id){
  //   console.log(id)

		const index: number = this.testIteams.indexOf(id);
    var _id = this.testIteams[index]["_id"]
		if (index !== -1) {
			this.testIteams.splice(index, 1)
		}
		//localStorage.setItem("selected_number", JSON.stringify(this.testIteams));
		//this.loadIteams();

    this.service
      .deleteAnyDataById("content_plan", _id)
        .subscribe((data: any) => {
          console.log(262, data);
          if(data.Error != 0){
            // No content plan saved...do nothing
            return;
          }
          //this.testIteams = data.content_plan
        });    

    
  }


  // Internal Link
  select_internal_link:any;
  selectInternalLink(event){
    this.select_internal_link = event.target.value;
  }
  internal_links:any=[]
  addInternalLink(){
    console.log(this.select_internal_link);
    this.internal_links.push(this.select_internal_link)
  }
  deleteInternalLink(link:any){
    const index: number = this.internal_links.indexOf(link);
    if (index !== -1) {
      this.internal_links.splice(index, 1)
    }
  }

  //Secondary Keywords
  secondary_keyword:any;
  secondary_keywords:any[]=[];
  addSecondaryKeyword(){
    console.log(this.secondary_keyword);
    this.secondary_keywords.push(this.secondary_keyword);
    this.secondary_keyword=''
  }
  deleteSecondaryKeyword(keyword:any){
    const index: number = this.secondary_keywords.indexOf(keyword);
    if (index !== -1) {
      this.secondary_keywords.splice(index, 1)
    }
  }

  //Secondary Keywords
  affiliate_link:any;
  affiliate_links:any[]=[];
  addAffiliateLink(){
    console.log(this.affiliate_link);
    this.affiliate_links.push(this.affiliate_link);
    this.affiliate_link=''
  }
  deleteAffiliateLink(keyword:any){
    const index: number = this.affiliate_links.indexOf(keyword);
    if (index !== -1) {
      this.affiliate_links.splice(index, 1)
    }
  }

  processPopup = [];
  currentContentType = ""
  currentBounty = {}
  addProcess(count, $event, bVariable, i){
    console.log(493, count, $event, bVariable, i);
    this.currentContentType = count.content_type
    this.processPopup[i] = true;
  }

  hideKeywordsProcess(i){
    this.processPopup[i] = false;
  }

  Page(endpoint){
    this.service
      .getAnyList("content_plan", 100, endpoint, { deployed: {$ne: true } })
        .subscribe((data: any) => {
          console.log(54, data);
          if(data.Error != 0){
            // No content plan saved...do nothing
            return;
          }
          
          this.testIteams = data.content_plan
          this.pagination = data.pagination
          console.log(60, this.pagination)
        });  
  }

  processByContentType = false;
  addProcessToSelectedContentType(){
    this.processByContentType = true;
    console.log(479, this.currentBounty)
  }

  massProcessAdd($event){
    //console.log(482, $event);
    $event.bounty = {}
    var bounty = $event;
    console.log(486, bounty);
  }

  massProcessHide(){
    this.processByContentType = false;

  }

  lastProcessUsed = null;
  myDate: any = null;

  dateSelected($event){
    console.log(534, $event);
  }

  useKeywordsProcess(pos, $event){
    this.testIteams[pos]["process"] = $event[0].process;
    this.testIteams[pos]["release_for_bounty"] = $event[0].release_for_bounty
    this.lastProcessUsed = this.testIteams[pos]["process"]
  }
  
  useLastProcess(pos){
    if(this.lastProcessUsed == null){
      alert("You must have applied a process at least once before doing this");
      return;
    }

    if(this.myDate == null){
      alert("You must pick a date for this to start");
      return;
    }

      this.testIteams[pos]["process"] = this.lastProcessUsed
      this.testIteams[pos]["release_for_bounty"] = this.myDate
      this.moveToStaging(pos)
  }

  moveToStaging(pos){


    this.testIteams[pos]["keywords"] = this.testIteams[pos]["unused_keyword"]
    if(typeof this.testIteams[pos]["process"] == 'undefined'){
      alert("You must add a process before you can move this to staging");
      return;
    }

    if(this.testIteams[pos]["brand_id"] == ""){
      if(this.selected_brand_id.length == 0){
        alert("You must select a brand first");
        return;
      } else {
        this.testIteams[pos]["brand_id"] = this.selected_brand_id
      }
    }

  if(this.testIteams[pos]["brand_id"] == ''){
        alert("Please select a brand first");
        return;
      }

  if(this.testIteams[pos]["brand_name"] == ''){
    if(this.selected_brand == ''){
        alert("Please select a brand first");
        return;
      }
    else{
      this.testIteams[pos]["brand_name"] = this.selected_brand;
    }
    }

      console.log(559, this.testIteams[pos]);

      //  return;

       
        console.log(564, this.testIteams[pos]);

            
            //console.log(523, removedItem[0]);    

    this.service.postAction("bounties", "singleusebounty", this.testIteams[pos]).subscribe(data => {

    var body = {
      keywords : data["bounty"]["keywords"],
      brand_id : data["bounty"]["brand_id"],
      bounty_id : data["bounty"]["_id"]
    }

    this.service.postAction("content_plan", "updatedeployedcontent", { "content_plan_id" : this.testIteams[pos]["_id"]}).subscribe(data => {
       
    console.log(515, data, body);

    this.service.postAction("keywords", "deploykeywordkfnotexistscreate", body).subscribe(data => {
        console.log(505, data);

        this.testIteams.splice(pos, 1)

      });

     });

  });

  }
}
