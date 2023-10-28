import {
  Component,
  ComponentFactory,
  ComponentRef,
  OnInit,
  Input,
  QueryList,
  ViewChildren,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';

import { CalendarItemComponent } from './calendar-item/calendar-item.component'
import * as moment from 'moment';
import { CalendarService } from '../calendar.service';
import { BaseService } from '../../base/base.service'
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.css']
  // styleUrls: ['./calendar-cell.component.css', './calendar-cell.component.scss']
})

export class CalendarCellComponent implements AfterViewInit, OnInit {

  show = true
  hide = false

  changeShowHide() {
    this.show = !this.show
    this.hide = !this.hide
    // console.log(this.show)
    // console.log(this.hide)
  }

  public popupEventFound: any;
  showPopupClicked(event: any) {
    this.popupEventFound = event;
    // console.log("trying")
    // console.log(this.popupEventFound)
  }
  /* Calendar Cell Options */
  @Input() date: any;
  @Input() isodate: string = ""
  @Input() private recvCalendarItem: EventEmitter<object>; // This is what allows this component receive all of the events emitted from the parent component;
  // I freely acknowledge there might be a different / better way, but this seemed to be a good
  // fit now.
  @Input() private closeMenusEvent: EventEmitter<boolean>

  @ViewChildren('comp', { read: ViewContainerRef }) dynComponents: QueryList<ViewContainerRef>;

  constructor(private _resolver: ComponentFactoryResolver, 
    public service: CalendarService, 
    public baseService: BaseService,
    public globalVars: Globals) {

  }

  dynamicCompInstance

  // We are creating a dynamically generated component
  // of type "CalendarItemComponent"
  loadComponent(calDateObj) {
    // Create this new component with the calDateObject
    // a map is similar to an array
    /*
      key / value pair system that allows to access data element 
      by a reference, and not an index
    */

    // This function allows you to add an item into the "map"
    // Its simialr to adding an item to an array, or adding an item
    // to another data structure, but in this case the data structure
    // is a map


    this.dynComponents.map(
      // A view container is available for every dom element
      // In this case, the 'view container' is for the "cell" and "comp"
      // are children items of the container
      // vcr == is the calendar cell
      // comp are children of the calendar cell
      (vcr: ViewContainerRef, index: number) => {
        // Create our calendar-items here
        const factory = this._resolver.resolveComponentFactory(
          CalendarItemComponent);

        const calItem = vcr.createComponent(factory).instance;
        this.dynamicCompInstance = calItem

        calItem.date = calDateObj.isodate;
        calItem._id = calDateObj._id;
        calItem.closeMenusEvent = this.closeMenusEvent
        calItem._dateKey = calDateObj._dateKey
        calItem._dateValue = calDateObj._dateValue
        calItem._variableData = calDateObj
        calItem.bMenu = calDateObj.bMenu
        // console.log(calDateObj.process[])
        calDateObj.process.forEach((pros) => {
          var name = pros.name
          calItem.menu.push(name)
        })
        // calItem.menu = calDateObj.menu
        calItem.key = calDateObj.key
        calItem.distinct = calDateObj.distinct
        this.globalVars.isLoading = false
        // console.log(114, this.globalVars.isLoading)
      }
    )
  }

  ngOnInit() {
    // This might be April 5th, 2020-04-05
    this.isodate = moment(this.isodate).format("YYYY-MM-DD")
    if (this.recvCalendarItem) {
      this.recvCalendarItem.subscribe(data => {
        if (data["isodate"] == this.isodate) {
          this.loadComponent(data)
        }
      });
    }
    // if (this.closeMenusEvent) {
    //   this.closeMenusEvent.subscribe(data => {
    //     console.log(131, "calendercell")
    //   });
    // }
  }
  ngAfterViewInit() {
  }

  dropEvent(event) {
    event.stopPropagation()
    var data = event.dataTransfer.getData("taskItem");
    var _id = event.dataTransfer.getData("_id");
    var _dateKey = event.dataTransfer.getData("_dateKey");
    var _dateValue = event.dataTransfer.getData("_dateValue");
    var element = document.getElementById(data);
    var droppedDate = event.target.attributes["data-isodate"].value; // the date of the cell that was droppped.  I stored it as a data-attirbute in the html

    event.target.appendChild(element);
    element.removeAttribute('id');
    event.srcElement.style = ""

    // I need to know what the date of the cell that the item was dropped into
    // I need ti know the date of the cell that the item was dropped from
    // and I need the _id of the mongoDC document to update.

    this.service.updateDate("bounty", _id, _dateKey, moment(droppedDate).format("YYYY-MM-DD"))
      .subscribe(
        (data: any) => {

              this.baseService.key = "bounty";
              var date = moment(droppedDate).format("YYYY-MM-DD")
              this.baseService.postAction("bounty", "updatebountyboxfoldername", {_id: _id, newFolderName: date}).subscribe(
                      (data: any) => {

                      });
        },
        (error) => {
          // console.log(40, "Error", error);
        })
  }

  allowDrop($event) {
    $event.preventDefault()
    $event.srcElement.style = "background-color:red; opacity:0.50;"
  }

  dragLeave($event) {
    $event.srcElement.style = ""
  }

}
