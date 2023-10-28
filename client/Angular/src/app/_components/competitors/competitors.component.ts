import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'

@Component({
  selector: 'app-competitors',
  templateUrl: './competitors.component.html',
  styleUrls: ['./competitors.component.css']
})

export class CompetitorsComponent extends BaseComponent implements OnInit {

  textClickedRoutes=["", "competitor-keyword"]

  constructor(public service: BaseService, public elementRef: ElementRef, 
    public sharedService: SharedService) { 
  	super(service, elementRef) 
  }

  ngOnInit(): void {
  	super.ngOnInit()

  	console.log(23, this.sharedService);
  		
  }

}
