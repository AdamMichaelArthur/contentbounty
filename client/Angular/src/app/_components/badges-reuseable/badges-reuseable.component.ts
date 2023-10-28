import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-badges-reuseable',
  templateUrl: './badges-reuseable.component.html',
  styleUrls: ['./badges-reuseable.component.css']
})
export class BadgesReuseableComponent implements OnInit {
  @Input() inputList:any[];
  @Output() outputEvent=new EventEmitter<any>();
  public badges:string[]=["badge badge-primary","badge badge-secondary","badge badge-success","badge badge-danger","badge badge-warning","badge badge-info"];

  constructor() { }

  ngOnInit(): void {

    console.log(17, this.inputList)

  }
  badgesClicked(event:any){
    this.outputEvent.emit(event);
  }
}
