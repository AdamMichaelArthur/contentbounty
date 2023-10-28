
// Input, ViewChild
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent extends BaseComponent implements OnInit {

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
              "required": true,
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
            },
            'validation':{
              "required": true
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
  editBrandStr: string = ""

  editDataForm = [
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
          "required": true,
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
        },
        'validation':{
          "required": true
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
                    "required": true
                  }
      }
    ]

  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef) 
    this.addDataFormStr = JSON.stringify(this.addDataForm)
    this.addKeywordStr = JSON.stringify(this.addKeywordForm)
    this.addTitleStr = JSON.stringify(this.addTitleForm)
    this.addProductStr = JSON.stringify(this.addProductForm)
    this.addPromptStr = JSON.stringify(this.addPromptForm);
    this.addLinkStr = JSON.stringify(this.addLinkForm);
    this.editBrandStr = JSON.stringify(this.editDataForm);
  }

  ngOnInit() {
    super.ngOnInit()

  }
  hidePopup(){
    this.displayTableButtonArea = !this.displayTableButtonArea
    // this.tableButtonSubviews[0] = false
  }

  flextableHeaderButtonClicked(event){

    // Create a folder...
    //console.log(149, event, typeof event);
    // if(typeof event == 'object'){
    //   console.log(151, event);
    //   if(typeof event.brand_name != 'undefined'){
        // Create a folder using the brand name in the linked box account
        console.log(154, "Create Brand", event.brand_name)
        this.service.postAction("brand", "createbrand", event).subscribe(
      (data: any) => {
        
        console.log(data);
      },
      (error) => {
        console.log(162, error);
      });
    //  }
    //}
  }
}
