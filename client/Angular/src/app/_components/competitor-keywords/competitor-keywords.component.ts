import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { SharedService } from '../../_services/shared.service'

@Component({
  selector: 'app-competitor-keywords',
  templateUrl: './competitor-keywords.component.html',
  styleUrls: ['./competitor-keywords.component.css']
})

export class CompetitorKeywordsComponent extends BaseComponent implements OnInit {

  constructor(public service: BaseService, public elementRef: ElementRef, public sharedService: SharedService)  { 
  	super(service, elementRef) 
  }

  ngOnInit(): void {
  	super.ngOnInit()

  	console.log(23, this.sharedService);

  }

}
