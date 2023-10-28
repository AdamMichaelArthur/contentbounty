import { Component, OnInit, Input, Output } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { EventEmitter } from '@angular/core';

import voca from 'voca';

@Component({
  selector: 'app-kickback',
  templateUrl: './kickback.component.html',
  styleUrls: ['./kickback.component.css']
})

export class KickbackComponent extends BaseComponent implements OnInit {

  @Input() _processSteps;
  @Input() response;

  @Input() _displayPopup: Boolean = true;
  @Input() _refreshTable: Boolean = true;

  ngOnInit(): void {
  	console.log(19, this._processSteps)
  	console.log(15, this.btn_response)
  }

  kickbackReason(response){
    console.log(44, this.kickbackStep, this.kickbackreason, response)

    this.service.postAction("bounty", "kickbackToStep", { "kickbackStep": this.kickbackStep, "bounty_id" : response.bounty.bounty_id, "refDocId":response.bounty.refDocId, "kickback_reason":this.kickbackreason }).subscribe((data: any) => {
          //this.tableButtonSubviews[3] = false;
          //this.displayTableButtonArea = false;
          this._displayPopup = false;
          this.hidePopup()

    })

  }

}
