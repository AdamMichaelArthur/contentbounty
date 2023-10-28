import {
  Component, OnInit, ElementRef, ViewChild, ViewChildren,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ComponentFactory,
  EventEmitter, Output
} from '@angular/core';

import { CalendarItemComponent } from './calendar-cell/calendar-item/calendar-item.component'
import { CalendarService } from './calendar.service';
import * as moment from 'moment';
import { range } from 'rxjs';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedService } from 'src/app/_services/shared.service';
import { BaseService } from '../base/base.service'
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  rows = [0, 7, 14, 21, 28];
  columns = [1, 2, 3, 4, 5, 6, 7];
  namesOfDays = moment.weekdaysShort()
  currentDate
  weeks
  dates
  selectedEndWeek
  selectedStartWeek
  prevMonthDate
  nextMonthDate
  weeklyView = false
  weekIndex = 1
  monthlyView = true;

  // Observable, this works just like other observables
  // The calendar cells are "subscribing" to this
  public recvCalendarItem: EventEmitter<object> = new EventEmitter();
  public closeMenusEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(public service: CalendarService, 
    public baseService: BaseService, 
    public sharedService: SharedService,
    public globalVars: Globals) {
  }

  status = [];

  ngOnInit() {
    if (this.sharedService.date) {
      this.currentDate = moment(this.sharedService.date);
      this.weeklyView = this.sharedService.weeklyView
      this.monthlyView = this.sharedService.monthlyView
    }
    else {
      this.sharedService.weeklyView = false
      this.sharedService.monthlyView = true
      this.currentDate = moment();
    }
    this.weekIndex = Math.ceil(this.currentDate.date()/7)
    console.log(48, this.currentDate)
    // console.log(49, this.sharedService.date)

    if(this.weeklyView)
    {
      this.weekIndex = Math.ceil(this.currentDate.date()/7)
      this.generateWeeklyCalendar(this.weekIndex)
    }
    else{
      this.generateCalendar();
    }
    this.globalVars.isLoading = true;

    this.getContentTypes();
    this.getBrands();
    this.getPlatforms();

    this.baseService.getDistinctArray("bounties", "pipeline", true).subscribe((data: any) => {
     
      console.log(85, data);
      this.status = data;
    })

  }

  activateWeeklyView(){
    this.generateWeeklyCalendar(this.weekIndex)
    this.weeklyView = true;
    this.monthlyView = false;
    this.sharedService.weeklyView = true
    this.sharedService.monthlyView = false
  }

  activateMonthlyView(){
    this.generateCalendar();
    this.monthlyView = true;
    this.weeklyView = false;
    this.sharedService.monthlyView = true
    this.sharedService.weeklyView = false
  }

  nextWeek(){
    if(this.weekIndex == 5){
      this.weekIndex = 1
      this.currentDate = moment(this.currentDate).add(1, 'months');
    }
    else {
      this.weekIndex += 1;
    }
    this.generateWeeklyCalendar(this.weekIndex)
  }

  prevWeek(){
    if(this.weekIndex == 1){
      this.currentDate = moment(this.currentDate).subtract(1, 'months');
      this.weekIndex = 5
    }
    else {
      this.weekIndex -= 1;
    }
    this.generateWeeklyCalendar(this.weekIndex)
  }

  public prevMonth(): void {
    this.globalVars.isLoading = true;
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    // console.log("previous Month: " + this.currentDate)
    this.generateCalendar();
  }

  public nextMonth(): void {
    this.globalVars.isLoading = true;
    this.currentDate = moment(this.currentDate).add(1, 'months');
    // console.log("next Month: " + this.currentDate)
    this.generateCalendar();
  }

  hideAllMenus() {

    this.closeMenusEvent.emit(true);
  }

  populateCalendarCells(data) {

    // This is hardcoded for 'bounty' but will be changed to be any datasource
    // This is the information we got from the backend.
    var bounties = data["bounty"];

    console.log(132, this.weeklyView, this.monthlyView);

    for (var i = 0; i < bounties.length; i++) {
      var bounty = bounties[i];
      var date = moment(bounty["release_for_bounty"]).format('YYYY-MM-DD')

      // We are emitting an event and sending it to ALL calendar calendarCells
      // This may nto be the most effecient, but it's a decent solution for a first
      // version / proof of concept
      // What this allows us to do is maintain our data state without using complicated
      // nested arrays or some other way.
      // console.log(bounty.process)
      this.recvCalendarItem.emit({
        ...bounty,
        ... {
          "isodate": date,  // THis is the date of the bounty, but in the -YYYY-MM-DD format
          "_dateKey": "release_for_bounty",
          "_dateValue": bounty["release_for_bounty"],
          "bMenu": false,
          "key": "step",
          "distinct": "content_type"
        }
      });
    }
    this.globalVars.isLoading = false;
  }

  private generateWeeklyCalendar(weekIndex): void {
    this.globalVars.isLoading = true;
    this.dates = []
    this.dates = this.fillDates(this.currentDate);
    this.weeks = [];

    // console.log(99, moment(this.dates[this.dates.length-1].isodate).format("YYYY-MM-DD"))

    // console.log(99, moment(this.dates[this.dates.length - 1].isodate).format("YYYY-MM-DD"))
    
    var begin = moment(this.dates[0].isodate).format("YYYY-MM-DD")
    var end = moment(this.dates[this.dates.length-1].isodate).format("YYYY-MM-") + moment().daysInMonth();
    
    switch(weekIndex) { 
      case 1: { 
        var sevenDays = this.dates.splice(0, 7)
         break; 
      } 
      case 2: { 
        var sevenDays = this.dates.splice(7, 7)
         break; 
      }
      case 3: { 
        var sevenDays = this.dates.splice(14, 7)
         break; 
      }
      case 4: { 
        var sevenDays = this.dates.splice(21, 7)
         break; 
      }
      case 5: { 
        var sevenDays = this.dates.splice(28, 7)
         break; 
      }
      default: { 
         break; 
      } 
   } 

    // var sevenDays = this.dates.splice(0, 7)
    this.weeks.push(sevenDays);

    // while (this.dates.length > 0) {
    //   var sevenDays = this.dates.splice(0, 7)
    //   this.weeks.push(sevenDays);
    // }

    // I'm getting the 1st day of the month and the last day of the month
    // and putting it into a format that can be sent to getDatesBetween
    // var begin = this.currentDate.format("YYYY-MM-01");
    // var end = this.currentDate.format("YYYY-MM-") + moment().daysInMonth();

    this.service.getBetweenDates(begin, end, this.filter).subscribe(
      (data: any) => {
        // console.log(data)
        this.populateCalendarCells(data)
      },
      (error) => {
        // console.log(40, "Error", error);
      })
  }

  private generateCalendar(): void {
    this.globalVars.isLoading = true;
    this.dates = []
    this.dates = this.fillDates(this.currentDate);
    this.weeks = [];

    // console.log(99, moment(this.dates[this.dates.length-1].isodate).format("YYYY-MM-DD"))

    // console.log(99, moment(this.dates[this.dates.length - 1].isodate).format("YYYY-MM-DD"))
    
    var begin = moment(this.dates[0].isodate).format("YYYY-MM-DD")
    var end = moment(this.dates[this.dates.length-1].isodate).format("YYYY-MM-") + moment().daysInMonth();

    while (this.dates.length > 0) {
      var sevenDays = this.dates.splice(0, 7)
      this.weeks.push(sevenDays);
    }

    // I'm getting the 1st day of the month and the last day of the month
    // and putting it into a format that can be sent to getDatesBetween
    // var begin = this.currentDate.format("YYYY-MM-01");
    // var end = this.currentDate.format("YYYY-MM-") + moment().daysInMonth();

    this.service.getBetweenDates(begin, end, this.filter).subscribe(
      (data: any) => {
        // console.log(data)
        this.populateCalendarCells(data)
      },
      (error) => {
        // console.log(40, "Error", error);
      })
  }

  private fillDates(currentMoment: moment.Moment) {
    var firstOfMonth = moment(currentMoment).startOf('month');
    var lastOfMonth = moment(currentMoment).endOf('month');

    var firstIndexOfGrid = firstOfMonth.day()
    var lastIndexOfGrid = lastOfMonth.day()

    var days = [];
    var day = firstOfMonth;
    var dayObject = {}

    var prevDay
    for (let i = firstIndexOfGrid; i > 0; i--) {
      prevDay = moment(firstOfMonth).subtract(i, 'days');
      // console.log("previous day: " + prevDay.toDate())
      dayObject = {
        "date": prevDay.toDate(),
        "isodate": prevDay.toISOString()
      }
      // days.push(prevDay.toDate());
      days.push(dayObject);
    }
    while (day <= lastOfMonth) {

      // days.push(day.toDate());
      //console.log(123, typeof day, )
      // var theDay = day.format('YYYY-MM-DD').toISOString
      // console.log(125, theDay)
      dayObject = {
        "date": day.toDate(),
        "isodate": day.toISOString()
      }
      days.push(dayObject);

      day = day.clone().add(1, 'd');
    }
    var nextDay
    if (6 - lastIndexOfGrid !== 0) {
      for (let i = 1; i < 7 - lastIndexOfGrid; i++) {
        nextDay = moment(lastOfMonth).add(i, 'days');
        // console.log("previous day: " + nextDay.toDate())
        // days.push(nextDay.toDate());
        dayObject = {
          "date": nextDay.toDate(),
          "isodate": nextDay.toISOString()
        }
        days.push(dayObject);
      }
    }

    return days
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  private isSelected(date: moment.Moment): boolean {
    return moment(date).isBefore(this.selectedEndWeek) && moment(date).isAfter(this.selectedStartWeek)
      || moment(date.format('YYYY-MM-DD')).isSame(this.selectedStartWeek.format('YYYY-MM-DD'))
      || moment(date.format('YYYY-MM-DD')).isSame(this.selectedEndWeek.format('YYYY-MM-DD'));
  }

  public isDayBeforeLastSat(date: moment.Moment): boolean {
    const lastSat = moment().weekday(-1);
    return moment(date).isSameOrBefore(lastSat);
  }

  public isDisabledMonth(currentDate): boolean {
    const today = moment();
    return moment(currentDate).isBefore(today, 'months');
  }

  public isSelectedMonth(date: moment.Moment): boolean {
    const today = moment();
    return moment(date).isSame(this.currentDate, 'month') && moment(date).isSameOrBefore(today);
  }

  dropEvent(event) {
    var data = event.dataTransfer.getData("taskItem");
    var _id = event.dataTransfer.getData("_id");
    var _dateKey = event.dataTransfer.getData("_dateKey");
    var _dateValue = event.dataTransfer.getData("_dateValue");
    var element = document.getElementById(data);
    console.log(205, element)
    var droppedDate = event.target.attributes["data-isodate"].value; // the date of the cell that was droppped.  I stored it as a data-attirbute in the html

    event.target.appendChild(element);
    element.removeAttribute('id');
    event.srcElement.style = ""

    // I need to know what the date of the cell that the item was dropped into
    // I need ti know the date of the cell that the item was dropped from
    // and I need the _id of the mongoDC document to update.

    console.log(234, "Update Date Called")

    this.service.updateDate("bounty", _id, _dateKey, moment(droppedDate).format("YYYY-MM-DD"))
      .subscribe(
        (data: any) => {

              console.log(238, "Update Date Called")
              // this.baseService.key = "bounty";
              // var date = moment(droppedDate).format("YYYY-MM-DD")
              // this.baseService.postAction("bounty", "updatebountyboxfoldername", {_id: _id, newFolderName: date}).subscribe(
              //         (data: any) => {
              //           console.log(240, data);
              //         });

        },
        (error) => {
          console.log(40, "Error", error);
        })
  }

  allowDrop($event) {
    $event.preventDefault()
    $event.srcElement.style = "background-color:red; opacity:0.50;"
  }

  dragLeave($event) {
    $event.srcElement.style = ""
  }

    brands = [];
    getBrands() {
      this.baseService
        .getDistinctArrayWithIds("brands", "brand_name", false)
        .subscribe((data: any) => {
          this.brands = data;
          console.log(32, this.brands);
        });
    }

    platforms = [];
    getPlatforms() {
      this.baseService
        .getDistinctArray("platforms", "platform")
        .subscribe((data: any) => {
          console.log(39, data);
          this.platforms = data;
        });
    }

    content_type = []
    getContentTypes() {
      this.baseService
        .getDistinctArrayWithIds("brands", "brand_name", false)
        .subscribe((data: any) => {
          this.brands = data;
          console.log(32, this.brands);
        });

      this.baseService
        .getDistinctArray("processes", "content_type", true)
        .subscribe((data: any) => {
          console.log(43, data);
          this.content_type = data;
        });

    }

  filter = null
  selected_brand: any = "";
  selected_brand_id: any = "";
  selectTargetBrand(event) {
    console.log(60, event.target.value);
    this.selected_brand = event.target.value;
    for (var i = 0; i < this.brands.length; i++) {
      if (this.brands[i].brand_name == event.target.value) {
        this.selected_brand_id = this.brands[i]._id;
       if(event.target.value == "Brand"){
         this.filter = null;
       } else {
         this.filter = { "brand_name" : event.target.value}
       }
       
       this.genCalendar()
      }
    }
  }

  genCalendar(){
       if((this.weeklyView)&&(!this.monthlyView)){
         this.generateWeeklyCalendar(this.weekIndex)  
       } else {
         this.generateCalendar()  
       }
  }

  selected_content: any = "";
  selectContentType(event) {
    console.log(196, event.target.value);
    if(event.target.value ==  "Content Type"){
      this.filter = null
    } else {
      this.filter = { "content_type" : event.target.value }
    }
    this.genCalendar()

  }

  selectCurrentStatus(event){
    if(this.filter == null){
      this.filter = { "pipeline" : event.target.value }
      console.log(483, this.filter);
      this.genCalendar();
      return;
    }
  }

}
