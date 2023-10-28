import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bounty-summary',
  templateUrl: './bounty-summary.component.html',
  styleUrls: ['./bounty-summary.component.css']
})
export class BountySummaryComponent implements OnInit,OnChanges {
  @Input() public data:any;
  summary:any;
  summaryText:any = []
  count:any;
  label=''
  @Output() public showDetailsEvent=new EventEmitter()

  constructor(private router:Router) {   }

  ngOnInit(): void {
    console.log(22, this.summaryText)

  }
  
  ngOnChanges(){
    if(this.data){
      this.summary=this.data.summary;
      this.summaryText = this.data.summaryText;
      this.count=this.data.bounty;
      this.label=this.data.label;
      console.log("sumary",this.summary,this.count,this.label)
    }
  }
  onShowDetails(){
    this.showDetailsEvent.emit({message:true})
  }
}
