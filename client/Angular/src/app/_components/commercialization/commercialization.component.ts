import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { FlexibleComponent } from '../flexible-table/flexible-table.component';

@Component({
  selector: 'app-commercialization',
  templateUrl: './commercialization.component.html',
  styleUrls: ['./commercialization.component.css']
})

export class CommercializationComponent extends BaseComponent implements OnInit {

  constructor(public service: BaseService, public elementRef: ElementRef) { 
  	super(service, elementRef) 
  }

  ngOnInit(): void {
  	super.ngOnInit()
  }

}
