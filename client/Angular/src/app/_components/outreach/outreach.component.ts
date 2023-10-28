import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'

@Component({
  selector: 'app-outreach',
  templateUrl: './outreach.component.html',
  styleUrls: ['./outreach.component.css']
})
export class OutreachComponent extends BaseComponent implements OnInit {

  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef) 
  }

  ngOnInit() {
    super.ngOnInit()
  }

}