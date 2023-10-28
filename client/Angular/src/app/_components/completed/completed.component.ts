import {Component, OnInit,ElementRef, ViewChild, ViewChildren} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FlexibleComponent} from '../flexible-table/flexible-table.component';
import {FlexibleTableService} from '../flexible-table/services/flexible-table-service';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, UntypedFormControl, Validators } from '@angular/forms';
import {CompletedService} from './completed.service';

import { BaseService } from '../base/base.service'
import { BaseComponent } from '../base/base.component';
import { SharedService } from '../../_services/shared.service'
import { Router, CanActivate } from '@angular/router';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss']
})

export class CompletedComponent extends BaseComponent implements OnInit {


  filters = [
    {
      "filter": false,
      "filterLabels": [ "Published" ],
      "label": "Filter",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "brand",
      "key": "brand_name",
      "distinct": "brand_name",

      "all":false
    },
    {
      "filter": { "brand_name": "" },
      "label": "Brand",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "bounties",
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

  filter = "";

  form: UntypedFormGroup;

  aggregateStr = `[
    { $project:{
        brand_name:1,
        content_type:1,
        pipeline:1,
        keywords:1,
        process:1
    }},
    {$unwind:"$process"},
    {$match:
      { $and:
        [  
          {"process.status": 'complete'},
          {"process.pipeline":"res.locals.user._id"}
        ]
      }
    },
    { $project:{

        brand_name:1,  
        content_type:1,
        bounty:"$process.bounty",
        name:"$process.name",
        description:"$process.description",
        pipeline:1,
        keywords:1,
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
                      pipeline:"$pipeline",
                      keywords:"$keywords",
                      bounty:"$bounty",
                      name:"$name",
                      description:"$description",
                      completion_order:"$completion_order"
                    } 
                  ] 
              } 
        }
    }
]`


constructor(
  private flexService: FlexibleTableService, public siteService: CompletedService,
  formBuilder: UntypedFormBuilder,
  fb: UntypedFormBuilder,
  public service: BaseService,
  public elementRef: ElementRef,
  private router: Router,
  public sharedService: SharedService,
) {
  super(service, elementRef)
  this.form = new UntypedFormGroup({
    checkArray: new UntypedFormControl([], [Validators.required])
  })
  this.errorText = '';
}

  ngOnInit(): void {
    super.ngOnInit()
    this.service.postAction("users", "balance").subscribe(data => {
        this.userBalance = `You have $${data["actions"].balance} Available to Withdraw`
      });
  }

  key="bounty"
  columns="brand_name,content_type,pipeline,keywords,bounty,name,description,completion_order,refDocId"
  all="progress"
  displayFileUpload="false"
  displayAddDataToSource="false"
  noDisplayColumns="refDocId"
  currencyColumns="bounty"
  noTextColumns="completion_order,refDocId"
  displayClone="false"
  displayDelete="false"
  buttons="brand_name,brand_name,brand_name"
  buttonNamesStr="Complete,Files,Unclaim"
  widths="0,300,150,150,150,150,150,150"
  textCutoff = [20, 20, 20, 10, 10, 20, 20]

  tableButtonClicked($event){
    console.log(27, "tableButtonClicked", $event);

    if($event.button == "Files"){
      return super.tableButtonClicked($event)
    }
    
    if($event.button == "Undo Complete"){
      //console.log(49, $event);
      //if($event.result == false){
        alert("This feature is still in-progres")
      //}
      //this.refreshTable();
      return;
    }

  }

  userBalance = ''
  
  public errorText: string;
  ifErrorMessage = false
  ifSuccessMessage = false
  public balance = {
    'card_number':'',
    'exp_month':'',
    'exp_year':'',
    'cvv2cvc2':'',
    'full_name':''
  }

  addUser(){
    if(this.balance.card_number && this.balance.exp_month && this.balance.exp_year && this.balance.cvv2cvc2 && this.balance.full_name){
      console.log(this.balance)
    }else{
        if(this.balance.card_number == ''){
          this.ifErrorMessage = true
          this.errorText = 'Card Number is required.'
        }else{
          if(this.balance.exp_month == ''){
            this.ifErrorMessage = true
            this.errorText = 'Exp Month is required.'
          }else{
            if(this.balance.exp_year == ''){
              this.ifErrorMessage = true
              this.errorText = 'Exp Year is required.'
            }else{
              if(this.balance.cvv2cvc2 == ''){
                this.ifErrorMessage = true
                this.errorText = 'CVV2/CVC2 is required.'
              }else{
                if(this.balance.full_name == ''){
                  this.ifErrorMessage = true
                  this.errorText = 'Full Name is required.' 
                }
              }
            }
          }
        }
      }
    }

    handleError(err){
      if(err.Error == 11000){
        this.ifErrorMessage = true
        this.errorText = err.Description
      } else {
        this.ifErrorMessage = true
        this.errorText = "There was a problem creating this account"
      }
    }

    flextableHeaderButtonClicked($event){
          this.service.postAction("users", "payout").subscribe(data => {
          console.log(98, data);
          this.userBalance = `You have $${data["actions"].balance} Available to Withdraw`
      });
    }

}
