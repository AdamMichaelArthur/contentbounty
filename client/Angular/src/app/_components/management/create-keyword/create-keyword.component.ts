
import { Component, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { BaseService } from '../../base/base.service';

@Component({
  selector: 'app-create-keyword',
  templateUrl: './create-keyword.component.html',
  styleUrls: ['./create-keyword.component.scss']
})
export class CreateKeywordComponent extends BaseComponent implements OnInit {

  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef) 
  }

  @Input() validation: any = {}

  @Input() addDataFormStr: any
  @Input() filter: any
  filterVariable: any
  @Input() tableButtonSubview: any
  @Input() displayTableButtonArea;

  @Output() displayTableButtonAreaBoolean = new EventEmitter<boolean>();

  fileUploadJsonFormat = {
    test: "test"
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.filterVariable = JSON.parse(this.filter)
    console.log(29,JSON.parse(this.filter))

    console.log(31, this.validation);
  }

  flextableHeaderButtonClicked(event){
    
    console.log(154, "Create Brand", event.brand_name)
      this.service.postAction("brand", "createbrand", event).subscribe(
    (data: any) => {
      console.log(data);
    },
    (error) => {
      console.log(162, error);
    });

  }

  hidePopup(){
    this.displayTableButtonArea = !this.displayTableButtonArea
    this.displayTableButtonAreaBoolean.emit(this.displayTableButtonArea);
    // this.tableButtonSubviews[0] = false
  }
  isMinMax:boolean = false
  minMaxPopup(){
    this.isMinMax = !this.isMinMax
  }

}


// eyJicmFuZF9pZCI6IjYwNmM1MGFmZGM4ODhhYTUyYzA4NWIzNyIgfQ==