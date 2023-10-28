import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { BaseService } from '../base/base.service'

@Component({
  selector: 'app-creators',
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.css']
})

export class CreatorsComponent implements OnInit {

  //import { BaseService } from '../base/base.service'
  constructor(public service: BaseService) {
    //super(service) 
  }

  ngOnInit() {
    //super.ngOnInit()
  }

  tableButtonClicked($event){
  	//super.tableButtonClicked($event);
  	console.log(22, $event);
  }
}
