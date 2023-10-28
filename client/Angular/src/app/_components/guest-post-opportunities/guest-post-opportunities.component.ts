import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-guest-post-opportunities',
  templateUrl: './guest-post-opportunities.component.html',
  styleUrls: ['./guest-post-opportunities.component.css']
})

export class GuestPostOpportunitiesComponent extends BaseComponent implements OnInit {

  
  brand_id = "";
  filterStr = "";
  loadFlextable = false;
  
  constructor(public service: BaseService, public elementRef: ElementRef,
    public sharedService: SharedService, private location: Location){
  	super(service, elementRef)
  }

  ngOnInit(): void {
  	super.ngOnInit()
  	this.brand_id = this.sharedService["_id"];
  	this.filterStr = `{ "brand_id": "${this.brand_id}"}`
	this.loadFlextable = true; 
  }

}
