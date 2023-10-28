import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'


@Component({
  selector: 'app-sniper-campaign-research',
  templateUrl: './sniper-campaign-research.component.html',
  styleUrls: ['./sniper-campaign-research.component.css']
})

export class SniperCampaignResearchComponent extends BaseComponent implements OnInit {

	filterStr = ''

  constructor(public service: BaseService, public elementRef: ElementRef, public sharedService: SharedService)  { 
  	super(service, elementRef) 
  }
  currentBounty = {}

  loadFlextable: boolean = false;
  bounty_id = ""
  brand_id = ""
  brand = {}
  bounty = {}
  bountyStep = {}

  ngOnInit(): void {
  	this.displayButtonArea = false;
    this.buttonSubviews[0] = false;

  	this.filterStr = `{ "brand_id": "${this.sharedService._variableData.brand_id}", "bounty_id":"${this.sharedService["_id"]}" } `;
  	this.bountyStep = this.sharedService._variableData
  	this.bounty_id = this.sharedService["_id"];

  	console.log(28, this.sharedService._variableData)
    this.bountyStep = this.sharedService._variableData

  	this.service.brandDataFromBountyId(this.bounty_id).subscribe(data => {
       this.brand = data["brand"];
       this.bounty = data["bounty"];
    //   this.brand_id =  this.brand["_id"]
       this.loadFlextable = true;

       console.log(47, this.brand, this.bounty);

    });

  }

    completeBounty($event){

      var body = { ... this.bountyStep }
      body["id"] = this.bounty["_id"];

      this.service.completeBountyFromSpecialtyComponent(body).subscribe(data => {
         console.log(53, data);
         //this.location.back()
      });

  }

  addGuide($event){
    
  }

}
