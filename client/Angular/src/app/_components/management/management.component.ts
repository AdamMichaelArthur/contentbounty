
// Input, ViewChild
import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent extends BaseComponent implements OnInit {

  @ViewChildren(FlexibleComponent) flexTables: QueryList<any>

  max_notification_levels = false;

  count = 0;

  slack_url = "";

  updateNotificationLevels(){
    console.log(26, "Update notification levels", this.max_notification_levels, this.response._id);

    this.service
      .updateAnyDataById("brands", { "notify_all_events": this.max_notification_levels }, this.response._id)
        .subscribe((data: any) => {
          console.log(262, data);
          if(data.Error != 0){
            // No content plan saved...do nothing
            return;
          }
          //this.testIteams = data.content_plan
        });

  }

  buttonNamesStr = "Keywords,Site Info,Pause,Resume,Templates"
  // buttonNamesStr = "Keywords,Prompts,Titles,Products,Links,Site Info,Templates"

  required_scopes = ['incoming-webhook','commands','chat:write','channels:history','groups:history','im:history','mpim:history','incoming-webhook'];

  //slack_url = `https://slack.com/oauth/v2/authorize?scope=${required_scopes.toString()}&client_id=${process.env.SLACK_APP_CLIENT_ID}`;"

  filters = [
    {
      "filter": { "Category":"$media_type" },
      "label": "Category",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "keywords",
      "key": "Category",
      "distinct": "Category"
    }
  ]

  iconMenus = [
    [
      "Emails",
      // "Competitors",
      // "Commercialization",
      "Link Building",
      "Keywords",
      "Inboxes"
      // "Social Media Engagement"
      // "Guest Post Opportunities",
      // "Developer Tasks"
    ]
  ]

  iconMenuRoutes = [
    [
      "emails",
      //"competitors",
      //"commercialization",
      "link-building",
      "keywords",
      "inboxes"
      //"guest-postOpportunities",
      //"developer-tasks"
    ]
  ]
  
  validation = {
    "sheets":[
       {
          "primary_key":"Keyword",
          "method":"update",
          "default":true
       }
    ]
  }

  addKeywordForm = [
      {
                  "field_label": "Keyword",
                  "field_name": "Keyword",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },{
                  "field_label": "Keyword and Title Are Similar/Same",
                  "field_name": "keyword_in_title",
                  "type": "String",
                  "formType": {
                      "controlType": "checkbox"
                  }
        },
      {
                  "field_label": "Volume",
                  "field_name": "Volume",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
      },
      {
                  "field_label": "Difficulty",
                  "field_name": "Difficulty",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
      },
      {
                  "field_label": "CPC",
                  "field_name": "cpc",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
      {
                  "field_label": "Organic",
                  "field_name": "organic",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
      {
                  "field_label": "Word Count Tolerance",
                  "field_name": "word_count_tolerance",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
      {
                  "field_label": "Words (Body) example: Between 1870 to 5730 words",
                  "field_name": "words_body",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
      {
                  "field_label": "Words (Heading) example: Between 63 to 215 words",
                  "field_name": "words_heading",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
      {
                  "field_label": "Number of times keyword should appear in the body of the article",
                  "field_name": "keywords_in_body",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
      {
                  "field_label": "Number of times keyword should appear in the H1 Title",
                  "field_name": "keywords_in_h1_title",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  }
        },
        {
                    "field_label": "Number of times keyword should appear in the Title",
                    "field_name": "keywords_in_title",
                    "type": "String",
                    "formType": {
                        "controlType": "text"
                    }
          }
  ]

  websiteUrlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  budgetReg = '^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$';

  addDataForm = [
        {
            "field_label": "Brand Name",
            "field_name": "brand_name",
            "type": "String",
            "formType": {
                "controlType": "text"
            },
            'validation':{
              "required": true
            }
        },
        {
            "field_label": "Website Url",
            "field_name": "website_url",
            "type": "String",
            "formType": {
                "controlType": "text"
            },
            'validation':{
              "pattern": this.websiteUrlReg
            }
        },
        {
            "field_label": "New Post Url",
            "field_name": "new_post_url",
            "type": "String",
            "formType": {
                "controlType": "text"
            },
            'validation':{
              "pattern": this.websiteUrlReg
            }
        },
        {
            "field_label": "New Post Login",
            "field_name": "new_post_login",
            "type": "String",
            "formType": {
                "controlType": "text"
            }
        },
        {
            "field_label": "New Post Pw",
            "field_name": "new_post_pw",
            "type": "String",
            "formType": {
                "controlType": "text"
            }
        },
        {
            "field_label": "Monthly Budget",
            "field_name": "monthly_budget",
            "type": "String",
            "formType": {
                "controlType": "text"
            },
            'validation':{
              "required": true,
              "pattern": this.budgetReg
            }
        }
    ]

  addKeywordStr: string = ""
  addPromptStr: string = ""
  addTitleStr: string = ""
  addProductStr: string = ""
  addLinkStr: string = ""
  addUploadKeywordStr: string = ""



  // iconMenuRoutes = [
  //   [
  //     "competitors",
  //     "linkbuilding",
  //     "keywords",
  //     "guestposts",
  //     "commercialization"
  //   ]
  // ]

  iconMenusStr = "";
  iconMenuRoutesStr = "";

  textCutoff = [10, 60, 70, 10, 10, 200]

  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef) 
    this.addDataFormStr = JSON.stringify(this.addDataForm)
    this.addKeywordStr = JSON.stringify(this.addKeywordForm)
    this.addTitleStr = JSON.stringify(this.addTitleForm)
    this.addProductStr = JSON.stringify(this.addProductForm)
    this.addPromptStr = JSON.stringify(this.addPromptForm);
    this.addLinkStr = JSON.stringify(this.addLinkForm);
    this.addUploadKeywordStr = JSON.stringify(this.addUploadKeywordForm)
    this.iconMenusStr = JSON.stringify(this.iconMenus)
    this.iconMenuRoutesStr = JSON.stringify(this.iconMenuRoutes)
  }

  ngOnInit() {
    super.ngOnInit()
    this.service.key = "brand"
    console.log(524, this.response)
  }
  hidePopup(){
    this.displayTableButtonArea = !this.displayTableButtonArea
    // this.tableButtonSubviews[0] = false
  }

// flextableHeaderButtonClicked($event) {
//         var requestBody = JSON.parse(this.filter);
//         this.service.getKeysForSearchQuery("keywords", requestBody).subscribe((data: any) => {
//           this.columnsStr = data.keywords.join(",");
//           this.flexTables.forEach(hello => {
//                if(hello.columns == "Keyword,Title,Volume,Difficulty,Type,Orangic,Words-Body,Words-Heading,Title,H1 Title"){
//                  hello.columns = data.keywords.join(",");
//                  hello.widthsAr = new Array(data.keywords.length).fill(200);
//                  console.log(hello)
//                  hello.refreshTableData()
//                }
//           });
//         })
//     }

  flextableHeaderButtonClicked(event){


          // this.flexTables.forEach(hello => {
            
          //   console.log(543, hello)

          //   if(hello.key == "keyword"){

          //     //console.log(540, JSON.parse(hello.filter))
              
          //     this.service.getKeysForSearchQuery("keywords", {"brand_id":"60777b0fe9eb5745911a4d75"}).subscribe((data: any) => {
          //         console.log(547, data)
             

          //      //if(hello.columns == "Keyword,KD,Volume,Category"){
          //         hello.columns = data.keywords.join(",");
          //         console.log(555, hello.columns)
          //         hello.widthsAr = new Array(data.keywords.length).fill(200);
          //         console.log(556, hello)
          //         hello.refreshTableData()
          //      //}
          //      });
          //   }

          // });
          
      console.log(154, "Create Brand", event.brand_name)
        this.service.postAction("brand", "createbrand", event).subscribe(
      (data: any) => {
        
        console.log(data);
      },
      (error) => {
        console.log(162, error);
      });

  }

  submitted = false

  updateSocialCookies(response){
    this.submitted = true

    console.log(JSON.stringify(response))

    var brand_id = response._id

    var values = Object.values(response)
    var keys = Object.keys(response);

    for(var i = 0; i < values.length; i++){
      if(typeof values[i] == 'undefined')
        response[keys[i]] = '';
    }

    var body = 
      {
        "facebook_cookie" : response.facebook_cookie,
        "instagram_cookie" : response.instagram_cookie,
        "linkedin_cookie" : response.linkedin_cookie,
        "youtube_cookie" : response.youtube_cookie,
        "twitter_cookie" : response.twitter_cookie,
        "google_photos_cookie":response.google_photos_cookie
      }

      console.log(355, brand_id, body);

    //this.service.key = "socialcookies"

    this.service.addDataById(brand_id, body).subscribe(
      (response: any) => {
        console.log(response)
        this.hidePopup()
        this.flexTable.refreshTableData()
      },
      (error) => {
        console.log(error)
      }
    )
  }

  currentBrandId = "";

  updateBrand(response){
    console.log(384, response);
    this.submitted = true
    console.log(JSON.stringify(response))

    var brand_id = response._id

    this.currentBrandId = brand_id;
    var body = 
      {
        "brand_name" : response.brand_name,
        "monthly_budget" : Number(response.monthly_budget),
        "new_post_login" : response.new_post_login,
        "new_post_pw" : response.new_post_pw,
        "new_post_url" : response.new_post_url,
        "website_url" : response.website_url,
        "zapier_webhook_url":response.zapier_webhook_url,
        "code_generator_url":response.code_generator_url
      }

    this.service.addDataById(brand_id, body).subscribe(
      (response: any) => {
        console.log(response)
        this.hidePopup()
        this.flexTable.refreshTableData()
      },
      (error) => {
        console.log(error)
      }
    )
  }

  sampleTemplate($event){
    // Generate a sample template based on a keyword upload

  }

  spreadsheets = [];

  tableButtonClicked($event){
    console.log(568, $event)

    this.currentBrandId = $event._id;

    this.max_notification_levels = $event.notify_all_events;
    
    this.count++;
    if($event.button == "Templates"){
      if($event.result == 0){
        alert("Error Retrieving Box Folder -- try again in a few moments")
      } else {
        alert("This will open the Templates folder.  Look for a blocked popup window notification if nothing happens")
        window.open($event.result.brandTemplateFolderSharedLink);
      }
      return;
    }

    if($event.button == "Site Info"){
      this.spreadsheets = $event.spreadsheets
      this.slack_url = $event.slack_url;
    }

    if($event.button == "Pause"){
      alert("All Bounties Are Paused")
      return;
    }

    if($event.button == "Resume"){
      alert("All Bounties Are Resumed")
      return;
    }

    if($event.button == "Keywords"){
          this.flexTables.changes.subscribe((children) => {
              children.forEach((child) => {
                 if(child.flextableName == "keywords"){
                     console.log(591, this.response);
                     child.tmpIdForExcelUpload = { "brand_id": $event._id };
                     child.filter=`{"brand_id":"{{ ${this.response._id} }}"}`
                 }
              });
          });
    }

    super.tableButtonClicked($event);    
  }
  
  addUploadKeywordForm = [
    {
                "field_label": "Product",
                "field_name": "Product",
                "type": "String",
                "formType": {
                    "controlType": "text"
                },
                'validation':{
                  "required": true
                }
    }
  ]

  addPromptForm = [
      {
                  "field_label": "Prompt",
                  "field_name": "Prompt",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  },

      },{
                  "field_label": "Keyword",
                  "field_name": "Keyword",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },
      {
                  "field_label": "Volume",
                  "field_name": "Volume",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },
      {
                  "field_label": "Difficulty",
                  "field_name": "Difficulty",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },
      {
                  "field_label": "CPC Test",
                  "field_name": "cpc",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
        },
      {
                  "field_label": "1231231",
                  "field_name": "kjkj",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
        },{
                  "field_label": "Keyword9",
                  "field_name": "Keyword9",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },
      {
                  "field_label": "Volume9",
                  "field_name": "Volume9",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },
      {
                  "field_label": "Difficulty9",
                  "field_name": "Difficulty9",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      },
      {
                  "field_label": "CPC Test9",
                  "field_name": "cpc9",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
        },
      {
                  "field_label": "12312319",
                  "field_name": "kjkj9",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
        }
  ]

  addTitleForm = [
        {
                    "field_label": "Title",
                    "field_name": "Title",
                    "type": "String",
                    "formType": {
                        "controlType": "text"
                    },
                    'validation':{
                      "required": true
                    }
        }
    ]

    addProductForm = [
      {
                  "field_label": "Product",
                  "field_name": "Product",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true
                  }
      }
    ]

    addLinkForm = [
      {
                  "field_label": "Link",
                  "field_name": "Link",
                  "type": "String",
                  "formType": {
                      "controlType": "text"
                  },
                  'validation':{
                    "required": true,
                    "pattern": this.websiteUrlReg
                  }
      }
    ]

    /*  This creates a Google Spreadsheet and associates it with this brand.
     *  This spreadsheet should be considered public information and will be made available
     *  to all contractors who work on the bounty
     *
    */
    addSpreadsheet($event){
      $event.stopPropagation();

      var title = prompt("What do you want to call this spreadsheet?");

      // Call the API that creates a spreadsheet.  
      this.service.createSpreadsheet(title).subscribe((data: any) => {

         var spreadsheetId = data.sheets.spreadsheetId;
         this.associateSpreadsheetWithBrand(spreadsheetId, title)
         // Now, we want to associate this sheet with this particular brand

      });
      return false;
    }

    associateSpreadsheetWithBrand(spreadsheetId, title){

       this.service.addToArray(this.currentBrandId, "spreadsheets", {"title":title, "id":spreadsheetId}, false).subscribe((data: any) => {

         console.log(670, data);
         // Now, we want to associate this sheet with this particular brand

      });
      //addToArray(id, key, value, pluralize = false)
    }
}
