import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-upload-referring-domains',
  templateUrl: './upload-referring-domains.component.html',
  styleUrls: ['./upload-referring-domains.component.css']
})
export class UploadReferringDomainsComponent extends BaseComponent implements OnInit {

  constructor(public service: BaseService, public elementRef: ElementRef,
    public sharedService: SharedService, private location: Location){
  	super(service, elementRef)
  }

  validation = {
    "sheets":[
       {
          "tag":"upload_domains",
          "primary_key":"Referring Page URL",
          "method":"update",
          "default":true,
          "preprocessing":"extractdomains",
          "exclude_search":["Referring Page URL","bounty_id", "owner", "created_by", "modified_by"],
          //"exclude_update":"bounty_id"
       }
    ]
  }

  loadFlextable: boolean = false;
  filterStr = "";
  bounty_id = ""
  brand_id = ""
  brand = {}
  bounty = {}
  bountyStep = {}

  ngOnInit(): void {

  	this.bounty_id = this.sharedService["_id"];

  	console.log(28, this.sharedService._variableData)
    this.bountyStep = this.sharedService._variableData

  	this.service.brandDataFromBountyId(this.bounty_id).subscribe(data => {
       this.brand = data["brand"];
       this.bounty = data["bounty"];
       this.brand_id =  this.brand["_id"]
       //this.filterStr = `{ "brand_id": "${this.brand_id}", "bounty_id":"${this.bounty_id}", "target_url": "${this.bounty["published_link"]}" }`
       this.filterStr = `{ "brand_id": "${this.brand_id}", "bounty_id":"${this.bounty_id}" }`
       
       //console.log(39, this.filterStr);
       this.loadFlextable = true;

    });

  }

  completeBounty($event){

      var body = { ... this.bountyStep }
      body["id"] = this.bounty["_id"];
      this.service.completeBountyFromSpecialtyComponent(body).subscribe(data => {
         console.log(53, data);
         this.location.back()
      });

  }
  
}
