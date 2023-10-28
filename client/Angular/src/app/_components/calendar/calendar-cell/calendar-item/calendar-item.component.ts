/*
    Each 'calendar-item' represents a single MongoDB collection
*/

import { Type, Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarService } from '../../calendar.service';

@Component({
  selector: 'app-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.css']
})

export class CalendarItemComponent implements OnInit {
  @Input() public closeMenusEvent: EventEmitter<boolean>

  /* The mongo _id of the document this collection represents */
  _id: string = "";

  /* The key inside the document that represents the date */
  _dateKey: string = "";

  /* The value of the _key */
  _dateValue: string = "";

  _variableData: object = {}

  date: any;

  bMenu: boolean = false;
  menu = [];
  displayThisMenu = false;

  key = "step"
  distinct = "content_type"


  /**
   * You need to pass relevant information to the new component:
  The mongo _id of the document this collection represents */
  // _id: string = "";
  // /* The key inside the document that represents the date */
  // _dateKey: string = "";
  // /* The value of the _key */
  // _dateValue: string = "";
  // _variableData: object = {}
  // date: any **/

  flowToNewRoute = true
  routeToGoTo = "bounty-detail"

  constructor(public calenderService: CalendarService) {

  }

  dragStart(ev) {

    // console.log(ev.target)
    ev.target.id = "taskid";
    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("_id", this._id);
    ev.dataTransfer.setData("_dateKey", this._dateKey);
    ev.dataTransfer.setData("_dateValue", this._dateValue);
    ev.dataTransfer.setData("key", this.key);
    ev.dataTransfer.setData("distinct", this.distinct);
    ev.dataTransfer.setData("data", this.menu);
  }

  ngOnInit() {
    // console.log(this._variableData)
    this.closeMenusEvent.subscribe(data => {
      if (this.displayThisMenu && this.bMenu) {
        this.bMenu = true
      }
      else {
        this.bMenu = false
      }
      this.displayThisMenu = false
      // console.log(132, "calenderItem")
    });
    console.log(81, this._variableData);
  }

  async hideEle(ele) {
    ele.hidden = true;
  }

  async findEle() {
    var ele = document.getElementById('bMenu')
    if (ele) {
      return ele;
    }
    else {
      return false
    }
  }

  displayMenu() {
    this.bMenu = !this.bMenu
    this.displayThisMenu = true
    this.closeMenusEvent.emit(true)
  }

  deleteBounty(event, bounty_id) {

    this.calenderService.deleteBounty(bounty_id).subscribe(
      (data: any) => {
        var element = event.target.parentNode.parentNode
        var parent = element.parentNode
        parent.removeChild(element)
      },
      (error) => {
        console.log(40, "Error", error);
      }
    )
    // testcode
    // var element = event.target.parentNode.parentNode
    // var parent = element.parentNode
    // parent.removeChild(element)
  }

}
