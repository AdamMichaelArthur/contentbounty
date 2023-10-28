import { Component, OnInit, SimpleChanges, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Input, ViewEncapsulation } from '@angular/core';
import { FlexibleTableService } from './services/flexible-table-service';
import { distinct } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, take, catchError } from 'rxjs/operators';
import { FormsModule, NgForm, FormArray } from '@angular/forms';
import { fromEvent, pipe, Observable } from 'rxjs';
import { delay, takeUntil, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

import voca from 'voca';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragEnter,
  CdkDragExit,
  CdkDragSortEvent
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon'
import { SharedService } from '../../_services/shared.service'
/*  Import all of the services from the /services folder
    
*/

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';

import { ReplaceUnderscorePipe, ShortPipe } from '../../custom_pipe/allpipe'

@Component({
  selector: 'flexible-table',
  templateUrl: './templates/flexible-table-dragdrop.html',
  styleUrls: ['./css/drag-n-drop.css', './css/table-header.css', './css/table-pagination.css',
    './css/columns.css'],
  encapsulation: ViewEncapsulation.None
})

// @Component({
//   selector: 'flexible-table-add-data-form',
//   templateUrl: './templates/add-data-form.html',
//   styleUrls: ['./css/drag-n-drop.css', './css/table-header.css', './css/table-pagination.css'],
//   encapsulation: ViewEncapsulation.None
// })

export class FlexibleComponent implements OnInit {

  alert:any=''; // For Toster Alert Message
  success_toster:boolean = false;
  error_toster:boolean = false;
  isLoading:boolean[] = []

  sample="https://www.google.com"


  datesDidChange($event){
    //console.log(68, "dates did change", $event, this.filtersObj);

    var filter = { "release_for_bounty" : { "$lte" : $event["toDate"], "$gte": $event["fromDate"] } }

    //this.filtersObj.unshift(filter);

    console.log(68, "dates did change", $event, this.filtersObj);

    //var currentOptions = JSON.parse(this.filter);
    var currentOptions = { ... JSON.parse(this.filter), ... { "release_for_bounty" : { "$lte" : $event["toDate"], "$gte": $event["fromDate"] } } }

    this.filter = JSON.stringify(currentOptions);
    
    console.log(78, this.filter);

    this.getInitialDataTableList(250);
    
  }

  // drag and drop by noor
  items = [
    'Carrots',
    'Tomatoes',
    'Onions',
    'Apples',
    'Avocados'
  ];

  basket = [
    'Oranges',
    'Bananas',
    'Cucumbers'
  ];

  dragDropNoor(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  addSourceData: UntypedFormGroup;
  addSourceData2: UntypedFormGroup

  /* Flexible Table MongoDB Collection, aka the "datasource" */
  @Input() key: string;

  /* Flexible Table Options */

  /* This causes a search bar to be displayed in the upper right hand corner of the column */
  @Input() displaySearch: boolean = true;
  @Input() textCutoff: Array<any> = [];
  /* This causes a spread-upload button to appear which allows you to upload data from an excel file into documents */
  @Input() displayFileUpload: boolean = true;
  @Input() disableDeleteDropdown: boolean = true;
  @Input() validation: any = {}
  @Input() displayHamburgerMenu: boolean = false;
  @Input() displayAddDataToSource: boolean = true;
  @Input() displayPageLength: boolean = true;
  @Input() displayPagination: boolean = true;
  @Input() displayDelete: boolean = true;
  @Input() displayClone: boolean = true;
  @Input() displayExport: boolean = true;
  @Input() displayFullLines: boolean = true;
  @Input() showAllColumnsOption: boolean = false;
  @Input() isDraggable: boolean = false;
  @Input() displayHeaders: boolean = true
  @Input() displayHeader: boolean = false;
  @Input() displayOptions: boolean = true;
  @Input() compact: boolean = false;
  @Input() borders: boolean = true;
  @Input() headerDisplayText = ""
  @Input() displayRecord: number = 10;
  @Input() maxCharacters: number = 50;
  @Input() dragAccept: any = "";
  @Input() headerButtons: string = "";
  @Input() currencySymbol = "$";
  @Input() currencyColumns: string = "";
  /* Flexible Table Columns, default is all */
  @Input() columns: string = "";
  @Input() buttons: string = "";
  @Input() dragdrop: string = "";
  buttonsAr: Array<any> = [];
  @Input() buttonNames: string = "";
  @Input() all = "";
  @Input() filter = "";
  @Input() headerIcons: string = ""
  @Input() headerIconNames: string = "";
  @Input() tableIcons: string = ""
  @Input() tableIconNames: string = "";
  @Input() tableIconMenus: string = "[]";
  @Input() tableIconMenuRoutes: string = "[]";
  @Input() filters: string = ""
  @Input() aggregate: string = ""
  @Input() noTextColumns: string = "";
  @Input() linkColumns: string = "";
  @Input() menuColumns: string = "";
  @Input() widths: string = "";
  @Input() deleteOnDrop = false;

  @Input() viewSelectColumns: string = ""
  @Input() sortableColumns: string = ""
  @Input() customColumns: string = ""
  @Input() customRows: string = ""
  @Input() customRoute: string = ""
  @Input() addDataToSourceDesc: string = "Add data to source"
  @Input() addDataFormStr: string = "";
  @Input() maxCharactersStr: string = ""
  @Input() flextableName: string = ""
  @Input() selectedButtons: string = "Delete Selected"
  @Input() max_records_default: number = 10;
  @Input() textClickedRoutes: Array<string> = [];
  @Input() addDateSearch = true;
  @Input() defaultSearchKey = "Keywords";
  //@Input() text!: number | string;
  //@Output() textChanged = new EventEmitter<number>();

  @ViewChildren('cell') flexCells;
  @ViewChildren('cell') flexRows;
  @ViewChildren('column') flexColumns;
  @ViewChildren('selectColumn') selectColumns;
  @ViewChildren('textColumn') textColumns;
  @ViewChildren('dateColumn') dateColumns;
  @ViewChildren('flexdropdown') flexDropDowns;
  @ViewChildren('rowcell') rowcells: ElementRef;

  tmpIdForExcelUpload: any = null;
  widthsAr: Array<any> = [];
  filtersObj: any;
  aggregateObj: any;
  filtersAr: Array<any> = [];
  filterLabelsAr: Array<any> = [];

  ngOnChanges(changes: SimpleChanges) {
    // Extract changes to the input property by its name
  }

  headerIconNamesAr: Array<string> = [];
  headerIconsAr: Array<string> = [];
  tableIconNamesAr: Array<string> = [];
  tableIconMenusAr: Array<any> = [];
  tableIconMenuRoutesAr: Array<any> = [];
  tableIconsAr: Array<string> = [];
  customColumnsAr: Array<string> = [];
  customRowsAr: Array<string> = [];

  dragdropAr: Array<string> = []
  buttonNamesAr: Array<any> = []
  headerButtonsAr: Array<string> = []
  selectedButtonsAr: Array<string> = []
  menuColumnsAr: Array<string> = []
  displayIconHeader: Array<boolean> = [];
  testDrag: boolean = true;
  viewSelectsAr: Array<boolean> = [];
  viewSelectColumnsAr: Array<string> = []
  sortableColumnsAr: Array<string> = []
  noTextColumnsAr: Array<boolean> = []
  linkColumnsAr: Array<boolean> = []
  rowOperationsAr: Array<boolean> = []
  rowOperationsGr: Array<boolean> = []
  columnsAr: Array<string> = [];
  maxCharactersAr: Array<number> = [];

  todoList = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  public service: FlexibleTableService;


  constructor(
    private formBuilder: UntypedFormBuilder,
    public sharedService: SharedService,
    public http: HttpClient,
    public cookieService: CookieService,
    public router: Router,
  ) {

    this.service = new FlexibleTableService(http, cookieService, router);

  }

  max_records: any = "10";

  test5() {
    console.log(190, "test5 Works");
    //this.getInitialDataTableList(this.max_records);
  }

  onChangeMaxRecord(maxrecords: any) {
    this.max_records = maxrecords;
    this.getInitialDataTableList(maxrecords);
    this.maxRecordDropdownUpdated.emit({
      "max_records":maxrecords
    })
  }

  refreshTableData() {

    console.log(242, this.service.datasourceUrl)

    var columns = "";
    if(typeof this.sharedService.xbody != 'undefined'){
      this.columns = this.sharedService.xbody;
    }

    this.loadingDataTablePagination(this.service.datasourceUrl);
    return;
    
    if(this.nextURL != ""){
      //this.next()
      //return;
    }

    console.log(241, "refreshing table data", this.nextURL, this.prevURL)

    this.getInitialDataTableList(this.max_records);
  }

  currencyColumnsAr: Array<string> = [];

  ngOnInit() {

    // this.datesSelected.subscribe(data => {
    //     console.log(131, data)
    //   });


    console.log(249, this.textCutoff);
    
    //console.log('get ngOnInit')
    //console.log(163, this.tableColumns);
    this.tableColumns = [];

    if (this.menuColumns.length > 0) {
      this.menuColumnsAr = this.buttons.split(",");
    }

    if (this.buttons.length > 0) {
      var numColumns = this.columns.split(",");
      var buttonNestedTmp = this.buttons.split(",");
      var buttonNamesNestedTmp = this.buttonNames.split(",")
      this.buttonsAr = this.buttons.split(",");
      this.buttonNamesAr = this.buttonNames.split(",")

      for(var i = 0; i < numColumns.length; i++){
        //this.buttonsAr[i] = buttonNestedTmp
        //this.buttonNamesAr[i] = [].concat(buttonNamesNestedTmp)
      }
    }

    if (this.widths.length > 0) {
      this.widthsAr = this.widths.split(",");
      //    this.flexColumns.toArray().forEach(
      //    val => {
      //      //val.nativeElement.style = "width:100px";
      //      //var cell = val.nativeElement.attributes["data-count"].value;
      //      //if(cell == (columns*rows)){
      //        //val.nativeElement.style = "display:none"
      //      //}
      //    }
      //    );
    }

    if (this.currencyColumns.length > 0) {
      this.currencyColumnsAr = this.currencyColumns.split(",");
    }

    if (this.dragdrop.length > 0) {
      this.dragdropAr = this.dragdrop.split(",");
    }

    if (this.headerButtons.length > 0) {
      this.headerButtonsAr = this.headerButtons.split(",");
    }

    if(this.selectedButtons.length > 0){
      this.selectedButtonsAr = this.selectedButtons.split(",")
    }

    if (this.tableIcons.length > 0) {
      this.tableIconsAr = this.tableIcons.split(",");
      this.tableIconNamesAr = this.tableIconNames.split(",");
    }

    // console.log(303, this.tableIconMenus)
    // console.log(304, this.tableIconMenuRoutes)
    
    // this.tableIconMenusAr = JSON.parse(this.tableIconMenus)
    // this.tableIconMenuRoutesAr = JSON.parse(this.tableIconMenuRoutes)

    // console.log(309, this.tableIconMenusAr)
    // console.log(310, this.tableIconMenuRoutesAr)

    //console.log(296, this.tableIconMenuRoutesAr[0]);

    if (this.headerIcons.length > 0) {
      this.headerIconsAr = this.headerIcons.split(",");
      this.headerIconNamesAr = this.headerIconNames.split(",");
    }

     if(typeof this.sharedService.xbody != 'undefined'){
       this.columns = this.sharedService.xbody;//.split(",");
       console.log(343, this.columns);
     }

    if (this.columns.length > 0) {
      this.columnsAr = this.columns.split(",");
      for (var i = 0; i < this.columnsAr.length; i++) {
        this.noTextColumnsAr.push(false);
        this.rowOperationsAr.push(false);
        this.rowOperationsGr.push(false);
      }
    }

    if (this.viewSelectColumns.length > 0) {
      this.viewSelectColumnsAr = this.viewSelectColumns.split(",");
      for (var i = 0; i < this.viewSelectColumnsAr.length; i++) {
        
      }
    }

    if (this.sortableColumns.length > 0) {
      this.sortableColumnsAr = this.sortableColumns.split(",");
      for (var i = 0; i < this.sortableColumnsAr.length; i++) {
        
      }
    }

    if (this.customColumns.length > 0) {
      this.customColumnsAr = this.customColumns.split(",");
      console.log(270, this.customColumnsAr);
    }


    if (this.customRows.length > 0) {
      this.customRowsAr = this.customRows.split(",");
      console.log(270, this.customRowsAr);
    }

    if (this.noTextColumns.length > 0) {
      var notextAr = this.noTextColumns.split(",");
      for (var i = 0; i < notextAr.length; i++) {
        for (var y = 0; y < this.columnsAr.length; y++) {
          if (notextAr[i] == this.columnsAr[y]) {
            this.noTextColumnsAr[y] = true;
          }
        }
        //if(this.columnsAr[i])
      }
    }

    if (this.linkColumns.length > 0) {
      var notextAr = this.linkColumns.split(",");
      for (var i = 0; i < notextAr.length; i++) {
        for (var y = 0; y < this.columnsAr.length; y++) {
          if (notextAr[i] == this.columnsAr[y]) {
            this.linkColumnsAr[y] = true;
          }
        }
        //if(this.columnsAr[i])
      }
    }

    if(this.maxCharactersStr.length > 0){
      var maxCharactersArStr = this.maxCharactersStr.split(",")
      for(var i = 0; i < maxCharactersArStr.length; i++){
        this.maxCharactersAr.push(parseInt(maxCharactersArStr[i]))
      }
    } else {
      for(var i = 0; i < 20; i++){
        this.maxCharactersAr.push(50)
      }
    }

    for (var i = 0; i < this.tableColumns.length; i++) {
      this.noTextColumnsAr.push(false);
    }

    this.checkIfViewSelect()

    console.log(416, this.sharedService.referringPage)
    if(typeof this.sharedService.referringPage == 'undefined'){
      this.getInitialDataTableList();
    } else {
      this.service.datasourceUrl = this.sharedService.referringPage
      //this.columns = this.sharedService.xbody
      console.log(422, this.columns);
      this.refreshTableData()
       //this.getInitialDataTableList();
    }

    this.initAddDataToSourceForm();

    if (this.dragAccept.length > 0) {
      // This is a string, convert it into an array
      this.dragAccept = this.dragAccept.split(",");
    }

    this.sendHeaderButtons.emit(this.headerButtons);
    this.sendTableButtons.emit(this.buttonNames);

    if (this.filters.length > 0) {
      this.filtersObj = JSON.parse(this.filters);
    }

    if (this.aggregate.length > 0) {
      //this.aggregate = btoa(this.aggregate)
      //console.log(319, this.aggregate)
    }

    if (Array.isArray(this.filtersObj)) {
      // Check and make sure this has become a proper array

      for (var i = 0; i < this.filtersObj.length; i++) {
        // Put our filters into an array
        this.filtersAr.push(this.filtersObj[i].filter)
        this.filterLabelsAr[i] = []
        this.filterLabelsAr[i].push(this.filtersObj[i].label)

        var advancedFilter = null;
        if(this.all == "all"){
          advancedFilter = "all";
        }

        if(typeof this.filtersObj[i].filterLabels != 'undefined'){
          console.log(453, i, this.filtersObj)
          for (var y = 0; y < this.filtersObj.length; y++) {
            console.log(454, i, this.filtersObj[y])
            if(i == y){
              console.log(456, this.filtersObj[i].filterLabels)
              this.filterLabelsAr[y] = this.filtersObj[i].filterLabels
            }
            //
          }

          continue;
        }

        this.service.getFilterOptions(this.filtersObj[i], advancedFilter).subscribe(
          (data: any) => {

            for (var y = 0; y < this.filtersObj.length; y++) {
              if (this.filtersObj[y].datasource == data.datasource) {
                this.filterLabelsAr[y] = this.filterLabelsAr[y].concat(data[data.datasource]);
              }
            }
            //filter.valueKeys = data[data.datasource]
          })
      }
    }
  }

  keywordInput: any
  emailLists: any = [];
  addEmail(keyWord: string) {
    this.emailLists = keyWord.split("\n").concat(this.emailLists);
  }

  addDataFormInitialized: boolean = false;
  // initital  add to data from 
  initFormControls() {
    this.addSourceData = this.formBuilder.group({
      key0: ['', Validators.required],
      key1: ['', Validators.required],
      key2: ['', Validators.required],
      key3: ['', Validators.required],
      key4: ['', Validators.required],
      key5: ['', Validators.required],
      key6: ['', Validators.required],
      key7: ['', Validators.required],
      key8: ['', Validators.required],
      key9: false,
      key10: ['', Validators.required],
      key11: ['', Validators.required]
    });
  }
  //
  // initFormControlssetData() {
  //   this.userForm.controls['TemplateName'].setValue(this.data.TemplateName)
  //   this.userForm.controls['TemplateJson'].setValue(this.data)
  // }

  // instance of from 
  initAddDataToSourceForm(): void {
    //this.initFormControlssetData();
  }

  bDropDownViewsAr: Array<boolean> = [];
  bSortableColumnsAr: Array<boolean> = []
  bCustomColumnsAr: Array<boolean> = [];
  //bCustomRowsAr: Array<boolean> = [];
  checkIfViewSelect() {
    for (var i = 0; i < this.columnsAr.length; i++) {
      this.bDropDownViewsAr[i] = false;
    }

    for (var i = 0; i < this.viewSelectColumnsAr.length; i++) {
      for (var y = 0; y < this.columnsAr.length; y++) {
        if (this.columnsAr[y] == this.viewSelectColumnsAr[i]) {
          this.bDropDownViewsAr[y] = true;
        }
      }
      //var colName = this.viewSelectColumnsAr[i];
    }

    // console.log(372, this.bDropDownViewsAr);
    this.makeBooleanArray(this.bSortableColumnsAr, this.sortableColumnsAr)
    this.MakeBooleanArray(this.bCustomColumnsAr, this.customColumnsAr)
    this.makeBooleanArray(this.bUp, this.sortableColumnsAr)

    //console.log(386, this.bSortableColumnsAr)
    //console.log(387, this.bCustomColumnsAr)
  }

  MakeBooleanArray(bArray: Array<boolean>, sArray) {
    for (var i = 0; i < this.columnsAr.length; i++) {
      bArray.push(false);
    }

    for (var i = 0; i < sArray.length; i++) {
      if (sArray[i].length > 0) {
        bArray[i] = true;
      }
    }
    // for(var i = 0; i < sArray.length; i++){
    //     for(var y = 0; y < this.columnsAr.length; y++){
    //       if(this.columnsAr[y] == sArray[i]){
    //         bArray[y] = true;
    //       }
    //     }
    //   }    
  }

  makeBooleanArray(bArray: Array<boolean>, sArray) {
    for (var i = 0; i < this.columnsAr.length; i++) {
      bArray.push(false);
    }

    for (var i = 0; i < sArray.length; i++) {
      for (var y = 0; y < this.columnsAr.length; y++) {
        if (this.columnsAr[y] == sArray[i]) {
          bArray[y] = true;
        }
      }
    }
  }


  resetWidths(){

      this.flexColumns.changes.subscribe(() => {
      var tmp = 0;
      this.flexColumns.toArray().forEach(
        val => {
          for (var i = 0; i < this.widthsAr.length; i++) {
            if (i == tmp) {
              val.nativeElement.style = `width:${this.widthsAr[i]}px;`;
              val.nativeElement.name = "columnWidth"
            }
          }
          tmp++;
        }
      );
    });

    this.flexDropDowns.changes.subscribe(() => {
      var tmp = 1;
      this.flexDropDowns.toArray().forEach(
        val => {
          var column = val.nativeElement.attributes["data-column"].value;
          val.nativeElement.style = `width:${this.widthsAr[column]}px;`;
          val.nativeElement.name = "columnWidth"
          tmp++;
          if (tmp > this.tableData.length)
            tmp = 1;
        });
    });

    this.setColumnWidth(this.textColumns);
    this.setCustomClasses(this.flexColumns);
  }

  setCustomClasses(column) {
    column.changes.subscribe(() => {
      var tmp = 1;
      column.toArray().forEach(
        val => {
          var columnNum = val.nativeElement.attributes["data-column"].value;
          val.nativeElement.name = "columnWidth"
          //val.nativeElement.style = `width:${this.widthsAr[columnNum]}px;`;
          //console.log(438, this.bCustomColumnsAr)
          if (this.bCustomColumnsAr[columnNum] == true) {
            val.nativeElement.classList.add(this.customColumnsAr[columnNum]);
            //console.log(451, this.customColumnsAr[columnNum]);
          }

          tmp++;
          if (tmp > this.tableData.length)
            tmp = 1;
        });
    });
  }


  setCustomRows(row) {

    row.changes.subscribe(() => {
      var tmp = 1;
      row.toArray().forEach(
        val => {
          //console.log(val);
          val.nativeElement.classList.add("smallrow");
          val.nativeElement.name = "columnWidth"
        });
    });
  }

  // setCustomRows(rows){
  //       rows.changes.subscribe(() => {
  //           var tmp = 1;
  //           column.toArray().forEach(
  //             val => {
  //                 var columnNum = val.nativeElement.attributes["data-column"].value;
  //                 //val.nativeElement.style = `width:${this.widthsAr[columnNum]}px;`;
  //                 console.log(438, this.bCustomColumnsAr)
  //                 if(this.bCustomColumnsAr[columnNum] == true){
  //                   val.nativeElement.classList.add(this.customColumnsAr[columnNum]);
  //                   console.log(451, this.customColumnsAr[columnNum]);
  //                 }

  //                 tmp++;
  //                 if(tmp > this.tableData.length)
  //                   tmp = 1;
  //             });
  //         });
  //   }

  setColumnWidth(column) {
    column.changes.subscribe(() => {
      var tmp = 1;
      column.toArray().forEach(
        val => {
          var columnNum = val.nativeElement.attributes["data-column"].value;
          var customWidth = val.nativeElement.attributes["data-column"].value;

          val.nativeElement.style = `width:${this.widthsAr[columnNum]}px;  text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`;
          tmp++;
          if (tmp > this.tableData.length)
            tmp = 1;
        });
    });
  }

  current_page_text: any = '';
  csvRecords: any[] = [];
  total_items: number;
  total_items_text: string = '';
  pagination: any = {}
  nextURL = "";
  prevURL = "";
  dataSource_list: any = [];
  table_Header: any = [];
  inilength: number = 0;
  length: number = 0
  addDataForm_value: any = [];
  bNoData: boolean = false;
  // getting initial data table list

  tableHeaders = [];
  tableData = [];
  tableColumns = [];
  iconColumns = [];
  formDefinitions = [];
  tableLabels = [];

  itemsPerPage: number = 10;

  corporationObj = "10"

  getInitialDataTableList(maxrecords = 0, overideFilter = null) {

    var getRecords = parseInt(this.corporationObj)

  // onChangeMaxRecord(maxrecords: any) {
  //   this.max_records = maxrecords;
  //   this.getInitialDataTableList(maxrecords);
  //   this.maxRecordDropdownUpdated.emit({
  //     "max_records":maxrecords
  //   })
  // }

    var records = document.getElementById("recordCount")


    console.log(727, this.corporationObj, this.max_records, this.displayRecord);


    if (this.displayRecord != 10) {
      getRecords = this.displayRecord - 1;
      this.max_records = getRecords;
    } else {
      this.max_records = 10;
    }

    var aggregate: any = false;
    if (this.aggregate.length > 0) {
      aggregate = this.aggregate;
    }

    var tmpFilter = this.filter;
    if(overideFilter != null){
      tmpFilter = overideFilter
    }

    console.log(743, this.max_records, getRecords);

    this.service.getInitialDataTableList(this.key, getRecords, this.columns, this.all,
      tmpFilter, "", aggregate).subscribe(
        (data: any) => {

          if (data.Error != 0) {
            // Nothing to do display;
            //this.bNoData = true;
            this.tableData = [];
            //this.dataSource_list = []
            //this.table_Header = []
            //this.tableHeaders = []
            if (this.addDataFormStr != "") {
              this.addDataForm_value = JSON.parse(this.addDataFormStr);
            }
            this.jsonToArray();
            return;
          }

          this.bNoData = false;
          this.dataSource_list = data[this.key];
          this.table_Header = data.headers;
          this.tableHeaders = data.headers;
          this.tableData = data[this.key]
          this.formDefinitions = data["addDataForm"];

          console.log(755, data["addDataForm"])

          this.tableLabels = data["displayHeaders"];
          //console.log(343, data["pagination"]);
          this.pagination = data["pagination"];
          this.addDataForm_value = this.formDefinitions
          //34console.log(623, this.addDataFormStr)
          if (this.addDataFormStr != "") {
            this.addDataForm_value = JSON.parse(this.addDataFormStr);
          }
          this.jsonToArray();
          // console.log(656, this.tableHeaders)
          // console.log(657, this.tableLabels)
          //this.initFormControls(data.addDataForm)
          this.length = this.table_Header.length;
          let paginationObj = data["pagination"];
          if (paginationObj != null) {
            this.nextURL = paginationObj["next_page_endpoint"];
            this.prevURL = paginationObj["prev_page_endpoint"];
            this.total_items = paginationObj["total_records"];
            this.total_items_text = "Total Items: " + this.total_items;
            var current_page = paginationObj["current_page"];
            this.current_page_text = current_page;
          }

          for (var i = 0; i < this.rowOperationsAr.length; i++) {
            this.rowOperationsAr[i] = false;
          }
          for (var i = 0; i < this.rowOperationsGr.length; i++) {
            this.rowOperationsGr[i] = false;
          }

        })
  }

  createAddDataToSourceForm() {
    // Request the first page
    // Look at the first record returned
    // Deduce from that what the add data to source form should look like
  }

  // getting value form list by pagination
  pageLoading:boolean = false;
  loadingDataTablePagination(url) {
    this.pageLoading = true;

    console.log(767, this.columns)

    this.service.loadingDataTablePagination(url, this.columns).subscribe(
      (data: any) => {

        console.log(654, this.pagination);
        if(data.pagination.current_page == 0){
          if(data.pagination.next_page == 0){
            if(data.pagination.number_of_pages == 0){
              // var paginationExists = voca.indexOf(this.service.datasourceUrl, "page", 0);
              // console.log(875, paginationExists)
              // if(paginationExists != -1){
              //   var id = voca.indexOf(this.service.datasourceUrl, "/id/", paginationExists);
              //   console.log(878, id);
              //   if(id != -1){
              //     var pageIndex = paginationExists + 5;
              //     var endPageIndex = id;
              //     var page = voca.substring(this.service.datasourceUrl, pageIndex, endPageIndex);
              //     var pageInt = parseInt(page);
              //     if(pageInt < 2){
              //       pageInt = 1;
              //     } else {
              //       pageInt--;
              //     }
              //     var pageStr = String(pageInt);
              //     var replaceFrom = `/page/${page}/id/`;
              //     var replaceTo = `/page/${pageStr}/id/`
              //     this.service.datasourceUrl = voca.replaceAll(this.service.datasourceUrl, replaceFrom, replaceTo)
              //     console.log(881, replaceFrom, replaceTo); 
              //   }
              // }
              this.service.datasourceUrl = this.pagination.prev_page_endpoint;
              console.log(872, "We need to start at the beginning!", this.service.datasourceUrl);
              if(this.pagination.current_page > 1){
                return this.refreshTableData();
              } else {
                return this.getInitialDataTableList(); 
              }
              
            }
          }
        }

        var undef;
        this.sharedService.xbody = undef;
        this.sharedService.referringPage = undef;
        this.dataSource_list = data[this.key];
        this.table_Header = data.headers;
        this.addDataForm_value = data.addDataForm
        
        // It's possible we get here from a delete operation that results in zero items being returned.
        // In this case, we need to return the previous page.



        if (this.addDataFormStr != "") {
          this.addDataForm_value = JSON.parse(this.addDataFormStr);
        }
        this.tableHeaders = data.headers;
        this.tableData = data[this.key]
        this.formDefinitions = data["addDataForm"];
        //console.log(343, data["pagination"]);
        this.pagination = data["pagination"];
        this.jsonToArray();
        this.length = this.table_Header.length;
        let paginationObj = data["pagination"];
        if (paginationObj != null) {
          this.pageLoading = false;
          this.nextURL = paginationObj["next_page_endpoint"];
          this.prevURL = paginationObj["prev_page_endpoint"];
          this.total_items = paginationObj["total_records"];
          this.total_items_text = "Total Items: " + this.total_items;
          var current_page = paginationObj["current_page"];
          this.current_page_text = current_page;
        }

        console.log(827, this.filterLabelsAr);

        for (var i = 0; i < this.rowOperationsAr.length; i++) {
          this.rowOperationsAr[i] = false;
        }
        for (var i = 0; i < this.rowOperationsGr.length; i++) {
          this.rowOperationsGr[i] = false;
        }

      })


  }

  //getting next pagination 
  next() {
    this.nextURL;
    this.loadingDataTablePagination(this.nextURL);
  }

  //getting privious pagination
  previous() {
    this.prevURL;
    this.loadingDataTablePagination(this.prevURL);
  }

  changeRowColor(_id){
    
    // Iterate through the dom
    // And div that has an id that matches _id, change it's background color to red
    
// for (let item of list) {
//     console.log(item.id);
// }

  }

  //  data delete by id
  deleteById(datasource_id, arPos =0) {

    this.rowOperationsAr[arPos] = true;

    console.log(this.pagination.number_of_pages)
    this.isLoading[datasource_id] = true;

    this.service.deleteById(datasource_id).subscribe(
      (data: any) => {

        //New Change By Imran
        const index: number = this.idsAr.indexOf(datasource_id);
        if (index !== -1) {
            this.idsAr.splice(index, 1);
        } 

        //New Change By Imran
        if(this.pagination.number_of_pages > 1){
          var curPageUrl = this.pagination.pages[this.current_page_text-1]
          console.log(711, curPageUrl.page_endpoint)
          this.loadingDataTablePagination(curPageUrl.page_endpoint)
        }else{
          this.getInitialDataTableList();
        }

        this.success_toster = true;
        this.alert= "Delete Successfull!";
        setTimeout(()=>{
          this.success_toster = false;
        },2000)
      },error=>{
        this.isLoading[datasource_id] = false;
        this.error_toster = true;
        this.alert = "Something is wrong!";
        setTimeout(()=>{
          this.error_toster = false;
        },2000)
      }
    )
  }

  // csv file download
  private baseUrl = environment.apiBase
  csvFileDownload() {
    var api_url = this.baseUrl + '/datasource/export/' + this.key;
    window.open(api_url, "_blank");
  }



  //  clone data by id
  duplicateById(datasource_id) {
    this.service.duplicateById(datasource_id).subscribe(
      (data: any) => {
        this.getInitialDataTableList();
      }
    )
  }
    // duplicateById(datasource_id) {
    //   this.service.duplicateById(datasource_id).subscribe(
    //     (data: any) => {
    //       this.getInitialDataTableList();
    //       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //         this.router.navigate(['/queue']);
    //       }); 
    //     }
    //   )
    // }

  // getting table header value from select option
  header: string = '';
  getOption(value: any) {
    if (value == "Select") {
      this.header = '';
    } else {
      this.header = value;

    }
  }

  // search  data by value from datalist 
  searchvalue = '';
  searchvalueError = false;
  searchvalueErrorTest = '';
  result = false;
  error_message: any = '';
  onEnter(value: any) {
 this.searchvalue = value


    if (this.searchvalue == '' || this.header == '') {
      if (this.searchvalue == '' && this.header == '') {
        this.searchvalueErrorTest = 'Please select search value and header value!!!'
        this.dataSource_list = this.dataSource_list
        this.searchvalueError = true;
        return;
      }

      if (this.header == '') {


        this.searchvalueError = true;
        this.searchvalueErrorTest = 'Please select header !!!'
        this.dataSource_list = this.dataSource_list
        return;
      
      }
      if (this.searchvalue == '') {
        this.searchvalueError = true;
        this.searchvalueErrorTest = 'Please enter search value !!!'
        this.dataSource_list = this.dataSource_list
        return;

      }
      return;
    } else {
      this.searchvalueError = false;
      // this.service.searchValueInList(this.searchvalue, this.key, this.header).subscribe(
      //   (data: any) => {
      //     this.dataSource_list = data[this.key];
      //     this.tableHeaders = data.headers;
      //     this.tableData = data[this.key]
      //     this.formDefinitions = data["addDataForm"];
      //   }
      // )

      var all: any = false;

      if(this.all != "")
        all = this.all;

      console.log(952, this.all)

      var searchaggregate: any = false;
      if(this.aggregate != ""){
        searchaggregate = this.aggregate;
      }

      this.service.searchValueInList(this.searchvalue, this.key, this.header, all, searchaggregate).subscribe(
        (data: any) => {
          var tmpData = []
          for(var i = 0; i < data[this.key].length; i++){
            var obj = {}
            obj["_id"] = data[this.key][i]["_id"]

            for(var x = 0; x< this.tableHeaders.length; x++){
              var key = this.tableHeaders[x]
              var val = data[this.key][i][key];
              if(typeof val == undefined)
                val = '';
              obj[key] = val;
            }
            tmpData.push(obj)
          }
          this.tableData = tmpData
          this.jsonToArray()
        }
      )
    }

  }

  updateTableFromSearch(data){
          this.bNoData = false;
          this.dataSource_list = data[this.key];
          //this.table_Header = data.headers;
          //this.tableHeaders = data.headers;
          this.tableData = data[this.key]
          // this.formDefinitions = data["addDataForm"];
          //this.tableLabels = data["displayHeaders"];
          //console.log(343, data["pagination"]);
          this.pagination = [];
          //this.addDataForm_value = this.formDefinitions
          //34console.log(623, this.addDataFormStr)
          //if (this.addDataFormStr != "") {
          //  this.addDataForm_value = JSON.parse(this.addDataFormStr);
          //}
          this.jsonToArray();
          //this.initFormControls(data.addDataForm)
          // this.length = this.table_Header.length;
          // let paginationObj = data["pagination"];
          // if (paginationObj != null) {
          //   this.nextURL = paginationObj["next_page_endpoint"];
          //   this.prevURL = paginationObj["prev_page_endpoint"];
          //   this.total_items = paginationObj["total_records"];
          //   this.total_items_text = "Total Items: " + this.total_items;
          //   var current_page = paginationObj["current_page"];
          //   this.current_page_text = current_page;
          // }

          // for (var i = 0; i < this.rowOperationsAr.length; i++) {
          //   this.rowOperationsAr[i] = false;
          // }
}

  // edit table data by id 
  editDataById(datasource, key, value, type = "string", selectAr) {

    var id = datasource._id;

    if (type == 'date') {
      var isDate = Date.parse(value);
      if (isNaN(isDate)) {
        // We have a bad date.
        return;
      }
    }

    if (type == 'boolean') {
      value = selectAr.checked
    }

    if (type == 'array') {
      // Create a clone of the array
      var valAr = [...value]

      // We have a dropdown
      var selectionPos = valAr.lastIndexOf(selectAr);
      if (selectionPos == -1) {
        try {
          selectAr = Number(selectAr)
        } catch (err) {

        }
        selectionPos = valAr.lastIndexOf(selectAr);
      }

      // Remove 'selectAr' from the array
      valAr.splice(selectionPos, 1);

      // Create a new array with selectAr in the array[0] position
      var newValue = [selectAr];

      newValue = newValue.concat(valAr)

      value = newValue;

    }

    var body = {
      "key": key,
      "value": value
    }

    this.service.editDataById(id, body).subscribe(
      (data: any) => {
      }
    )

  }

  //  excel file upload with validation 
  excel_loaded: boolean = false;
  excelloaded: boolean = false;
  excelSrc: string = "";
  initialExcel: string = "";
  currentExcel: string = "";
  excel_file_Error: string = "";
  excel_file_Info: string = "";
  excelFileData = {};

  _validFileExtensions = [".xlsx", ".xls", ".csv"];
  Validate(e) {
    var file = e.target.files[0];
    var pattern = /.spreadsheetml.sheet/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      // alert('invalid format');
      this.excel_file_Error = "invalid file Formato";
      return;
    } else {
      this.excel_file_Error = "";
      this.excel_file_Info = "Chosen File Name: " + file.name;
      this.excelFileData = file;

      this.excel_loaded = false;
      reader.onload = this.excelIsloaded.bind(this);
      reader.readAsDataURL(file);
    }
    this.openFileUpload()
  }

  excelIsloaded(evt) {
    var reader = evt.target;
    this.currentExcel = reader.result;
    const result = reader.result;
    if (result.length * 2 > 2 ** 21) {
      this.excel_loaded = false;
    } else {
      this.excel_loaded = true;
    }
  }

  cancelExcel() {
    this.currentExcel = "";
    this.excel_loaded = false;
  }

  // excel file upload related functions with service
  file_status = "Submit File";
  uploading = false;

  uploadExcelFile() {

    this.file_status = "Uploading File...";
    this.uploading = true;
    var params = "";

    if (this.filter.length > 0) {
      params = this.filter;
    }

    console.log(1067, params);
     
    this.service
      .uploadExcelFile(this.excelFileData, params, this.tmpIdForExcelUpload)
      .subscribe(
        (data: any) => {
          if (data.Error === 505) { } else {
            this.excel_loaded = false;
            this.uploading = false;
            this.excel_file_Info = "File uploaded successfully!";
            console.log(1077, this.filter)
            this.filter = this.tmpIdForExcelUpload
            this.getInitialDataTableList(0, JSON.stringify(this.tmpIdForExcelUpload));
            // setTimeout(() => {
            //   //console.log("11")
            //   this.addfile = true;
            // }, 3000)
          }
        },
        error => {
          this.excel_loaded = false;
          this.excel_file_Info = "";
          this.excel_file_Error = "File dropped! Please reselect file!";
        });
  }

  receiveTmpIDForExcelUpload($event){
    console.log(1137, $event)
    this.closeFileUpload()
    this.refreshTableData()
  }

  // Open close  data source popup
  opendataSource = true;
  addfile = false;

  openDataSource() {
    this.opendataSource = !this.opendataSource
    this.addfile = false;
    this.getDataSourceValueKey()


    var div = document.getElementById("adddatasource");
    var button = document.getElementById("adddatatosourceBtn")
    var buttonRect = button.getBoundingClientRect();
    var container = document.getElementById("page_container").getBoundingClientRect();
    div.style.top = String(buttonRect.bottom) + "px"
    var divRect = document.getElementById("adddatatosourceBtn").getBoundingClientRect();
    //var container = document.getElementById("page_container").getBoundingClientRect();
    var test = divRect.left - container.left

    div.style.left = test + "px";

  }

  closeDataSource() {
    this.opendataSource = !this.opendataSource
    this.datasourceFormDynamic.reset()
    this.submitted = false
  }

  // Open close file upload popup
  openFileUpload() {
    this.addfile = true
    this.opendataSource = true;
    var div = document.getElementById("addfile");
    var button = document.getElementById("addfileBtn")
    var buttonRect = button.getBoundingClientRect();
    var container = document.getElementById("page_container").getBoundingClientRect();
    div.style.top = String(buttonRect.bottom) + "px"
    var divRect = document.getElementById("addfileBtn").getBoundingClientRect();
    //var container = document.getElementById("page_container").getBoundingClientRect();
    var test = divRect.left - container.left

    div.style.left = test + "px";
    this.uploadExcelFile()
  }

  openFileUploader(event: any) {
    // event.preventDefault();
    // event.stopPropagation();
    this.addfile = true
    // this.opendataSource = true;
    console.log(1187, "trytesting")
    
    // var div = document.getElementById("addfile");
    // var button = document.getElementById("addfileBtn")
    // var buttonRect = button.getBoundingClientRect();
    // var container = document.getElementById("page_container").getBoundingClientRect();
    // div.style.top = String(buttonRect.bottom) + "px"
    // var divRect = document.getElementById("addfileBtn").getBoundingClientRect();
    // //var container = document.getElementById("page_container").getBoundingClientRect();
    // var test = divRect.left - container.left

    // div.style.left = test + "px";
    // this.uploadExcelFile()
  }

  closeFileUpload() {
    this.addfile = false
    // this.uploadExcelFile()

  }

  // getting from control value
  get formcontrols() {
    return this.addSourceData.controls;
  }

  submitted = false;
  errorfrombrand = false;
  errorfrombounty_release = false;
  errorfromqueued_content = false;
  errorfromcontent_Type = false;
  errorfrommax_Budget = false;
  errorfromspend = false;
  errorfromcreator = false;
  errorfromtest = false;
  errorfromkeywords = false;
  errorfrompipeline = false;
  errorfromcurrent_Bounty = false;
  errorfrom = false;
  addsourceTest = ''

  //From reload from after submission  
  reInitAddDataToSourceForm() {
    this.addSourceData = this.formBuilder.group({
      brand: [''],
      bounty_release: [''],
      queued_content: [''],
      content_Type: [''],
      max_Budget: [''],
      spend: [''],
      current_Bounty: [''],
      creator: [''],
      pipeline: [''],
      published: false,
      keywords: [''],
      test: ['']
    });
  }


  // calling for create new value dynamacillay 
  getDataSourceValueKey() {
    // var nameArray = this.addDataForm_value.map(function (el) {
    //   return el.key;
    // });

  }

  /*################ datasourceFormDynamic Form ################*/
  datasourceFormDynamic = this.formBuilder.group({})

  /*############### Add Dynamic Elements in datasourceFormDynamic ###############*/
  get addDynamicElement() {
    return this.datasourceFormDynamic as UntypedFormGroup
  }

  // itemsArray = [
  //   {
  //     "field_label": "Brand Name",
  //     "field_name": "brand_name",
  //     "type": "number",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Release for Bounty",
  //     "field_name": "release_for_bounty",
  //     "type": "text",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Queued Content",
  //     "field_name": "queued_content",
  //     "type": "number",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Content Type",
  //     "field_name": "content_type",
  //     "type": "text",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Max Budget",
  //     "field_name": "max_budget",
  //     "type": "number",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Spend",
  //     "field_name": "spend",
  //     "type": "number",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Current Bounty",
  //     "field_name": "current_bounty",
  //     "type": "number",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Creator",
  //     "field_name": "creator",
  //     "type": "text",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Pipeline",
  //     "field_name": "pipeline",
  //     "type": "text",
  //     "html_type": "input"
  //   },
  //   {
  //     "field_label": "Published",
  //     "field_name": "published",
  //     "type": "radio",
  //     "options": [
  //       "True",
  //       "False"
  //     ],
  //     "html_type": "radio"
  //   },
  //   {
  //     "field_label": "Keywords",
  //     "field_name": "keywords",
  //     "type": "select",
  //     "options": [
  //       1.25,
  //       0,
  //       4,
  //       5.35
  //     ],
  //     "html_type": "select"
  //   },
  //   {
  //     "field_label": "Some Date",
  //     "field_name": "some_date",
  //     "type": "picker",
  //     "html_type": "picker"
  //   }
  // ]

  // add value dynamically in datasourceFormDynamic
  addItems() {

    //console.log(1034, "addItems Called");
    // console.log("1")
    // setInterval(()=>{
    //   console.log("11")
    //   this.addfile = true;
    // },3000)

    for (let i = 0; i < this.addDataForm_value.length; i++) {

      // ------------- validation related code to be use later: starts------//
      // var theValidators = this.itemsArray[i].validators
      // var validatorArray = []

      // for (const [key, value] of Object.entries(theValidators)) {
      //   if (key == 'required') {
      //     validatorArray.push(Validators.required)
      //   }
      //   if (key == 'minLength') {
      //     validatorArray.push(Validators.minLength(Number(value)))
      //   }
      // }
      // ------------- validation related code to be use later: ends------//
      if (this.addDataForm_value[i].type == 'boolean') {
        this.addDynamicElement.addControl(
          this.addDataForm_value[i].field_name,
          new UntypedFormControl(
            false
          )
        );
      }
      else {
        if(this.addDataForm_value[i].validation)
        {
          if(this.addDataForm_value[i].validation.required)
          {
            this.addDynamicElement.addControl(
              this.addDataForm_value[i].field_name,
              new UntypedFormControl(
                '', [Validators.required] 
              )
            );
            if(this.addDataForm_value[i].validation.pattern)
            {
              this.addDynamicElement.get(this.addDataForm_value[i].field_name).setValidators([
                Validators.pattern(this.addDataForm_value[i].validation.pattern),
                this.addDynamicElement.get(this.addDataForm_value[i].field_name).validator
              ]);
            }
          }
          else
          {
            if(this.addDataForm_value[i].validation.pattern){
              this.addDynamicElement.addControl(
                this.addDataForm_value[i].field_name,
                new UntypedFormControl(
                  '', [Validators.pattern(this.addDataForm_value[i].validation.pattern)] 
                )
              );
            }
          }
        }
        else {
          this.addDynamicElement.addControl(
            this.addDataForm_value[i].field_name,
            new UntypedFormControl(
              ''
            )
          );
        }
        // console.log("2")
        // setInterval(()=>{
        //   console.log("22")
        //   this.addfile = true;
        // },3000)
      }
    }
    this.addDataFormInitialized = true;
  }

  // update published value
  updatePublished(value) {
    if (value) {
      this.addDynamicElement.get("published").setValue(true)
    }
    else {
      this.addDynamicElement.get("published").setValue(false)
    }
  }
  // update published value end

  // Submit datasourceFormDynamic Form
  onSubmitDatasourceFormDynamic(form: any) {

    var addDataToSourceFormValue = form
    this.submitted = true;
    if(form.valid)
    {
      var addDataToSourceFormValue = form
      console.log(1309, addDataToSourceFormValue)

      console.log(1298, this.filter)
      var filters = null;
      if (this.filter.length > 0) {
        filters = JSON.parse(this.filter);
      }
      console.log(1315, this.filter, this.filters);

      var keys = Object.keys(addDataToSourceFormValue.value)
      var formSubmit = {}
      for (var i = 0; i < keys.length; i++) {
        var isNumber = parseInt(addDataToSourceFormValue.value[keys[i]]);
        console.log(1174, isNumber, isNaN(isNumber));
        if (!isNaN(isNumber)) {
          formSubmit[keys[i]] = isNumber
        } else {
          formSubmit[keys[i]] = addDataToSourceFormValue.value[keys[i]]
        }
      }

      this.service.addDataToSourceForm(formSubmit, filters)
      .subscribe(
        (data: any) => {
          //this.addsourceTest = 'Sucessfully added';
          //this.getDataSourceValueKey();
          this.idsAr = [];
          this.closeDataSource()
          this.getInitialDataTableList();
          //this.addDynamicElement.controls.value = null
        },
        (error) => {
          // this.errorFound = true
          // this.errorMessage = error
          // this.openSnackBar("Payment Method Delete Failed!", "snackbar-class-warning")
        })

      console.log(1206, "Ok....");
      this.onHeaderBtnClicked(formSubmit)
      console.log(1329, formSubmit);
    }

    
  }




  // provide type to table input fields
  giveType(value) {
    if (typeof value == 'string') {
      if (!isNaN(Date.parse(value))) {
        return 'text'
      }
      return 'text'
    }
    if (typeof value == 'number') {
      return 'number'
    }
  }

  preventInput(event: any, value: any) {
    event.preventDefault()
    event.stopPropagation()

    if (isNaN(Date.parse(value))) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  idsAr: Array<string> = [];
  dragallows: Array<boolean> = [];
  test = [];
  transferArray: Array<any> = [];

  jsonToArray() {
    
    console.log(1639, this.tableData)
    
    if(this.tableData.length == 0){
      this.pageLoading = false;
      //return;
    }

    //console.log(1458, this.idsAr);

    this.idsAr = [];
    var tableRows = this.tableData;
    
    var tableColumns = [];
    var iconColumns = [];

    for (var t = 0; t < tableRows.length; t++) {
      var rowobj = {}
      var row = tableRows[t]
      var rowKeys = Object.keys(row);

      this.idsAr.push(row._id)
      for (var y = 1; y < rowKeys.length; y++) {
        rowobj[rowKeys[y]] = row[rowKeys[y]]
        if (!Array.isArray(tableColumns[y])) {
          // We haven't created an empty array here yet...let's do this now
          tableColumns[y] = [];
          iconColumns[y] = []
        }

        for (var u = 0; u < this.currencyColumnsAr.length; u++) {
          if (this.currencyColumnsAr[u] == rowKeys[y]) {
            row[rowKeys[y]] = this.currencySymbol + String(row[rowKeys[y]]);
          }
        }

        var cell = row[rowKeys[y]];

        try {
          iconColumns[y].push(cell.split(","));
        } catch (err) {
          iconColumns[y].push([]);
        }

        if(cell == null){
          cell = "";
        }

        if (cell.length > this.maxCharacters) {
          //cell = cell.substring(0, this.maxCharacters)
          // add icon here
        }

        if (cell.length == 0) {

        }

        tableColumns[y].push(cell)
      }
      this.transferArray.push(rowobj);
    }


    for (var i = 0; i < tableColumns.length - 1; i++) {
      this.dragallows.push(false);
    }

    for (var i = 0; i < this.tableHeaders.length; i++) {
      for (var y = 0; y < this.dragdropAr.length; y++) {
        if (this.dragdropAr[y] == this.tableHeaders[i]) {
          this.dragallows[i] = true;
        }
      }
    }
    this.tableColumns = tableColumns
    this.iconColumns = iconColumns;
    this.addItems();
    if (this.tableColumns.length >= 1) {
      this.test = this.tableColumns[1];
    }

    this.receivedTableData.emit(this.tableData)

    for(var i = 0; i < this.tableData.length; i++){

      var table = JSON.parse(this.tableIconMenus)
      var routes = JSON.parse(this.tableIconMenuRoutes)

      //console.log(1589, table, routes)
      this.tableIconMenusAr[i] = [].concat(table)
      this.tableIconMenuRoutesAr[i] = [].concat(routes) 
    }

    //this.tableIconMenusAr = JSON.parse(this.tableIconMenus)
    //this.tableIconMenuRoutesAr = JSON.parse(this.tableIconMenuRoutes)
//     console.log(1596, this.tableIconMenusAr, this.tableIconMenuRoutesAr)

  }

  replaceItemInArray(arrItem, currentIndex) {

  }

  resetRowAnimation(id, row){
      this.isLoadingGr[id] = false;    
      this.rowOperationsGr[row] = false;
  }

  getRowInfo(event, r, y){
    console.log(1827, event, r, y);

    var thisAr = [];
    for (var i = 1; i < this.tableColumns.length; i++) {
      if (Array.isArray(this.tableColumns[i][r])) {
        thisAr.push(this.tableColumns[i][r][0])
      } else {
        thisAr.push(this.tableColumns[i][r])
      }
    }
    var row = {}
    for (var i = 0; i < this.columnsAr.length; i++) {
      row[this.columnsAr[i]] = thisAr[i]
    }

    row["_id"] = event.srcElement.id;
    row["name"] = event.srcElement.name;

    return row;
  }

  isLoadingGr:boolean[]=[]
  dynamicButtonClicked(event: any, r=0, y) {
    console.log(1850, event, event.target.innerHTML, r, y);
    // Imran -- this works, but we should be trying to writer resusable code.
    if(event.target.innerHTML===" Claim " || event.target.innerHTML===" Complete " || event.target.innerHTML===" Publish " || event.target.innerHTML===" Approve " || event.target.innerHTML===" Complete Inhouse " ){
      this.rowOperationsGr[r] = true;
      this.isLoadingGr[event.target.id] = true;
    }

    var thisAr = [];
    for (var i = 1; i < this.tableColumns.length; i++) {
      if (Array.isArray(this.tableColumns[i][r])) {
        thisAr.push(this.tableColumns[i][r][0])
      } else {
        thisAr.push(this.tableColumns[i][r])
      }
    }
    var row = {}
    for (var i = 0; i < this.columnsAr.length; i++) {
      row[this.columnsAr[i]] = thisAr[i]
    }

    console.log(1870, this.key, event.srcElement.id, event.srcElement.name, row);

    this.service.dynamicButton(this.key, event.srcElement.id, event.srcElement.name, row).subscribe(
      (data: any) => {
        console.log(1872, data);
        // Display a popup here of the button results
        data.actions["_id"] = event.srcElement.id;
        data.actions["key"] = this.key;
        data.actions["button"] = event.srcElement.name;
        data.actions["row"] = r;
        this.tableBtnClicked(data.actions);
      }
    )
  }

  selectedRows = [];
  atLeastOneRowSelected = false;
  checkValue(event: any, r=0, y, id) {

    this.service.rowSelected(this.key, id).subscribe(
      (data: any) => {
        this.atLeastOneRowSelected = true;
        var bRemoveButton = true;
        for(var i = 0; i < this.tableData.length; i++){
         if(this.tableData[i]["_id"] == id){
           this.tableData[i]["selected"] = !this.tableData[i]["selected"]
         }

         if(this.tableData[i]["selected"] == true){
            this.atLeastOneRowSelected = true;
            bRemoveButton = false;
          }
        }
        if(bRemoveButton){
          this.atLeastOneRowSelected = false;
        }
      }
    )

  }

  @Output() onHeaderButtonClicked = new EventEmitter<string>();
  @Output() onSelectedButtonClicked = new EventEmitter<string>();
  @Output() sendHeaderButtons = new EventEmitter<string>();
  @Output() sendTableButtons = new EventEmitter<string>();
  @Output() tableButtonClicked = new EventEmitter<object>();
  @Output() iconClicked = new EventEmitter<object>();
  @Output() headerDropdownChanged = new EventEmitter<object>();
  @Output() receivedDropItem = new EventEmitter<object>();
  @Output() receivedTableData = new EventEmitter<object>();
  @Output() tableDataChanged = new EventEmitter<object>();
  @Output() tableItemDeleted = new EventEmitter<object>();
  @Output() tableItemCopied = new EventEmitter<object>();
  @Output() dropdownItemDeleted = new EventEmitter<object>();
  @Output() maxRecordDropdownUpdated = new EventEmitter<object>();

  public updateMenuItem: EventEmitter<object> = new EventEmitter();

  bMenu: boolean = false;

    _id: string = "";

  /* The key inside the document that represents the date */
  _dateKey: string = "";

  /* The value of the _key */
  _dateValue: string = "";

  _variableData: object = {}

  date: any;

  
  menu = ["Item 1", "item 2", "Item 3"];
  displayThisMenu = false;

//  key = "step"
  distinct = "content_type"

  flowToNewRoute = true
  routeToGoTo = [
    [
      "welcome",
      "management"
    ],    [
      "queue",
      "team"
    ],    [
      "calendar",
      "welcome"
    ],    [
      "management",
      "queue"
    ]
  ]

  // Lazy programming here, but I have things to do
  bIconRows = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
  bIconColumns = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];


  changeMenuItem(row, name, route){
    console.log(1749, row, name, route, this.tableIconMenuRoutesAr)
    this.tableIconMenusAr[row][0].push(name);
    this.tableIconMenuRoutesAr[row][0].push(route);

    console.log(1749, this.tableIconMenuRoutesAr)
  }

  onIconClicked(event, r=0, y, id, name, column) {

    this.bIconRows[r] = !this.bIconRows[r];
    this.bIconColumns[column] = !this.bIconColumns[column];
    this.iconClicked.emit(event);

    var row = this.getRowInfo(event, r, y)
    row["_id"] = id;
    row["name"] = name;

    if(!this.bIconRows[r]){
      this.bIconRows = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    }
    if(!this.bIconColumns[column]){
      this.bIconColumns = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    }
  }


  bMouseEnterTimer = false;
  activateDropdownTimer(i: any, y: any){
    this.bMouseEnterTimer = true;
    clearTimeout(this.lastTimeout)
    console.log(1746, "Mouse Enter Timer")
  }

  lastTimeout: any = false;
  
  hideDropDown(r, i){
      console.log(1737, this.bMouseEnterTimer)

      if(!this.bMouseEnterTimer)
        return;
      clearTimeout(this.lastTimeout)
     this.lastTimeout = setTimeout( () => {
        this.bIconRows[r] = false; 
        this.bIconColumns[i] = false;
        this.bIconRows = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
        this.bIconColumns = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
      }, 1500)

  }

  onHeaderBtnClicked(btnName) {
    console.log("Emitting onHeaderButtonClicked", btnName);
    this.onHeaderButtonClicked.emit(btnName);
  }

  onSelectedBtnClicked(btnName) {
    console.log("Emitting onSelectedButtonClicked", btnName);
    this.onSelectedButtonClicked.emit(btnName);
  }

  tableBtnClicked(response) {
    this.tableButtonClicked.emit(response);
  }

  // onHeaderDropdownChanged(dropdownData){
  //   this.headerDropdownChanged.emit(dropdownData);
  // }

  displayIconTooltip(event, column, icon) {

  }

  hideIconTooltip(event) {
  }

  resetFilters(){
    this.combinedFilter = {}
  }

  combinedFilter = {}

  aggregateStrOrig = ""

  onFilterSelected(filter, value, label ="") {

    // if 

    

    console.log(1901, value, label);
    console.log(1903, this.combinedFilter)

    var dropdownData = {
      "filter": "filter",
      "value": value,
      "label":label
    }

    //console.log(1931, "Testing order of execution", filter, this.filtersObj[filter]);

    this.headerDropdownChanged.emit(dropdownData);




    var filterObj = this.filtersObj[filter];
    
        console.log(1966, this.filtersObj[filter]);

    if (filterObj.filter == false) {
      // The purpose here is a simple dropdown...notify the parent controller
      console.log(1060, value);
      return;
    }

    var mongoFindQuery = filterObj.filter;



    if(filterObj.key != "")
      mongoFindQuery[filterObj.key] = value;

    console.log(1984, filterObj.key, value)

    console.log(1979, mongoFindQuery)

    // for(var object in mongoFindQuery){
    //   console.log(1958, object);
    //   if(object == ""){
    //     delete mongoFindQuery[object]
    //   }
    // }

    console.log(1991, this.combinedFilter)

    //if(filterObj.key != "")
      this.combinedFilter = { ... this.combinedFilter, ... mongoFindQuery }

    if(value == label){
      delete this.combinedFilter[this.filtersObj[filter].key]
      //console.log(1905, this.filtersObj[filter].key)
    }

    this.filter = JSON.stringify(this.combinedFilter);

    console.log(1967, this.filter);
    //console.log(1921, this.filter);

    //console.log(1932, this.aggregate)

    //var agg = eval(this.aggregate)

    if(this.aggregate.length > 0){
      var matchStr = `{ "$match": ${this.filter} },`
      
      if(this.aggregateStrOrig.length == 0)
        this.aggregateStrOrig = this.aggregate;
      else {
        this.aggregate = this.aggregateStrOrig
      }

      if(this.filter.length > 2){
        var output = [this.aggregate.slice(0, 2), matchStr, this.aggregate.slice(2)].join('');
        this.aggregate = output;
        console.log(1934, output)
      }
      //this.aggregateObj
    }

    //console.log(1936, agg);

    console.log(1941, this.aggregate)
    this.getInitialDataTableList(250);
  }

  currentCoord = {
    x: 0,
    y: 0
  }

  // test1: Array<boolean> = [false, false, false, false, false, false, false, false];

  // onHoverColumn(status: boolean, columnIndex) {
  //   if (status == true) {
  //     this.currentCoord.y = columnIndex
  //     //if(this.currentCoord.x != 0)
  //     //if(columnIndex == 2)
  //     //this.test1[columnIndex] = true;

  //   } else {
  //     this.currentCoord.y = 0;
  //   }
  // }

  // onHoverRow(status: boolean, rowIndex, event = null) {
  //   rowIndex = rowIndex + 1
  //   if (status == true) {
  //     if (this.currentCoord.y == 4) {

  //       this.test1 = [false, false, false, false, false, false, false, false];
  //     }
  //     this.test1[rowIndex - 1] = true;
  //     this.currentCoord.x = rowIndex

  //     //if(this.currentCoord.y != 0)
  //     //event.srcElement.style.backgroundColor = "green"
  //   } else {
  //     if ((this.currentCoord.y + 1) != this.tableColumns.length)
  //       this.test1[rowIndex - 1] = false;
  //     //this.test1[rowIndex] = false;
  //     this.currentCoord.x = 0
  //   }
  // }
  
  test1: boolean[] = [];
  onHoverColumn(status: boolean, columnIndex) {
    // this.test1[columnIndex] = !this.test1[columnIndex]
  }
  onHoverRow(status: boolean, rowIndex, event = null) {
    this.test1[rowIndex] = !this.test1[rowIndex]
  }


  onDropdownChange(value, y, i) {
    var cell = this.tableColumns[0]
    this.swap(this.tableColumns[y][i], this.tableColumns[y][i].indexOf(value), 0)
  }

  swap(input, index_A, index_B) {
    let temp = input[index_A];

    input[index_A] = input[index_B];
    input[index_B] = temp;
  }

  Page(endpoint: string) {
    this.nextURL;
    console.log(2021, endpoint);
    this.loadingDataTablePagination(endpoint);
  }

  selectCellClass(bNoText: boolean, row) {

    var currentRow = this.tableHeaders[row]
    for (var i = 0; i < this.tableIconsAr.length; i++) {
      var iconColumnName = this.tableIconsAr[i];
      if (this.noTextColumns.indexOf(iconColumnName) != -1) {
        if (currentRow == iconColumnName)
          return "flexrow_span_empty";
      }
      if (currentRow == iconColumnName) {
        return "flexrow_span";
      }
    }
    return "flexrow_span_notext";
  }

  selectColumnClass(compact: boolean, noTextColumn: boolean) {
    if (compact == true) {
      return "flexrow-compact"
    }

    if (noTextColumn == true) {
      return "flexrow_notext";
    }

    return "flexrow";

  }

  setdate(date) {
    var rval = new UntypedFormControl(new Date(Date.parse(date)))
    return rval;
  }

  editField() {
    console.log(1196, "Double Click")
  }

  sorted($event) {
    console.log(1200, "Sorted")
  }

  temp: any = []


  sorting($event, column) {
    //console.log(1247, "Sorting", $event, column)

  }

  columnClicked(column) {
  }

  bUp: Array<boolean> = [];
  headerClicked($event, headerPos, test) {

    console.log(1491, this.bUp);
    if (this.bSortableColumnsAr[headerPos] == false) {
      // initiate a sort against this column
      return;

    }

    var sortKey = this.tableHeaders[headerPos];
    var sortBy = "";

    if (this.bUp[headerPos]) {
      sortBy = "asc"
    } else {
      sortBy = "desc"
    }
    this.bUp[headerPos] = !this.bUp[headerPos]

    var getRecords = this.max_records;

    var sort = {}

    sort[sortKey] = sortBy

    this.service.getInitialDataTableList(this.key, getRecords, this.columns, this.all,
      this.filter, JSON.stringify(sort)).subscribe(
        (data: any) => {
          console.log(1504, data);
          if (data.Error != 0) {
            this.tableData = [];
            this.jsonToArray();
            return;
          }

          this.bNoData = false;
          this.dataSource_list = data[this.key];
          this.table_Header = data.headers;
          this.tableHeaders = data.headers;
          this.tableData = data[this.key]
          this.formDefinitions = data["addDataForm"];
          this.tableLabels = data["displayHeaders"];
          this.pagination = data["pagination"];
          this.addDataForm_value = this.formDefinitions
          console.log(1518, this.addDataFormStr)
          if (this.addDataFormStr != "") {
            this.addDataForm_value = JSON.parse(this.addDataFormStr);
          }
          var rVal = this.jsonToArray();
          this.length = this.table_Header.length;
          let paginationObj = data["pagination"];
          if (paginationObj != null) {
            this.nextURL = paginationObj["next_page_endpoint"];
            this.prevURL = paginationObj["prev_page_endpoint"];
            this.total_items = paginationObj["total_records"];
            this.total_items_text = "Total Items: " + this.total_items;
            var current_page = paginationObj["current_page"];
            this.current_page_text = current_page;
          }

        console.log(2187, this.formDefinitions)

        for (var i = 0; i < this.rowOperationsAr.length; i++) {
          this.rowOperationsAr[i] = false;
        }
        for (var i = 0; i < this.rowOperationsGr.length; i++) {
          this.rowOperationsGr[i] = false;
        }

        })
  }

  dropEvent($event, column, row) {

    var data = this.tableData[row]

    var dropTargetData = {
      _id: data._id,
      column: column,
      row: row,
      key: this.tableHeaders[column],
      value: this.tableColumns[column + 1][row]
    }

    var dropOriginData = JSON.parse($event.dataTransfer.getData("dropOriginData"));

    console.log("Emitting event", dropTargetData, dropOriginData)

    this.receivedDropItem.emit({
      ...dropTargetData,
      ...dropOriginData
    });
  }

  /*  These outputs are used to inform the parent component
    of relevant drag and drop events
*/
  @Output() onDragStart = new EventEmitter<object>();
  @Output() onDragEnd = new EventEmitter<object>();
  @Output() onDragEnter = new EventEmitter<object>();
  @Output() onDragLeave = new EventEmitter<object>();
  @Output() onDragOver = new EventEmitter<object>();
  @Output() onDropEvent = new EventEmitter<object>();

  dragLeave($event, column, row) {
    //console.log("Drag Leave");
    //this.endDrag($event)
    //$event.srcElement.style = ""
  }

  startDrag(e, column, row) {

    var id = this.idsAr[row]
    var obj = {}
    for (var i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i]["_id"] == id)
        obj = this.tableData[i];
    }

    console.log(1615, obj);

    e.dataTransfer.setData("data", JSON.stringify({
      _id: this.idsAr[row],
      data: this.tableColumns[column + 1][row],
      obj: JSON.stringify(obj),
    }));

    e.dataTransfer.dropEffect = "copy";
    e.srcElement.classList.add('dragging');
    this.onDragStart.emit(e);
  }

  endDrag(e, column, row) {
    console.log('Finished dragging button');
    e.srcElement.classList.remove('dragging');
    this.dropEvent(e, column, row)
    this.onDragEnd.emit(e)
  }

  testIm:boolean[]=[]
  handleDragEnter2(a){
    this.testIm[a] = true;
    if(this.testIm[a] = true){
      setTimeout(()=>{
        this.testIm[a] = false
      },2000)
    }
  }
  handleDragLeave2(a){
    this.testIm[a] = false
  }

  handleDragEnter(e, column, row) {
    e.preventDefault();
    e.srcElement.classList.add('over');
    var dropTargetData = {
      column: column,
      row: row,
      key: this.tableHeaders[column],
      value: this.tableColumns[column + 1][row],
      event: e
    }

    this.onDragEnter.emit(dropTargetData)
  }

  handleDragOver(e, column, row) {
    var data = this.tableData[row]

    var dropTargetData = {
      _id: data._id,
      column: column,
      row: row,
      key: this.tableHeaders[column],
      value: this.tableColumns[column + 1][row]
    }

    //console.log(1536, e);

    //console.log(1537, e.dataTransfer);
    //var dropOriginData = JSON.parse(e.dataTransfer.getData("dropOriginData"));

    this.onDragOver.emit({
      event: e,
      ...dropTargetData
      //... dropOriginData
    });

    //this.onDragOver.emit(e)
  }

  handleDragLeave(e, column, row) {
    e.srcElement.classList.remove('over');
    this.onDragLeave.emit(e)
  }

  handleDrop(e, column, row) {
    this.onDropEvent.emit(e)
    // prevent navigation when dropping links
    var data = e.dataTransfer.getData("Text");
    console.log('Button dropped with data: ' + data);
    e.srcElement.classList.remove('over');
    this.dropEvent(e, column, row);
  }

  updateField(id, column, value){
    // Update a specific fields
    var x = 0, y = 0;
    for(var i = 0; i < this.idsAr.length; i++){
      if(this.idsAr[i] == id){
        y = i;
        break;
      }
    }
    for(var i = 0; i < this.tableLabels.length; i++){
      if(this.tableLabels[i] == column){
        x = i+1;
        break;
      }
    }

    this.tableColumns[x][y] = value

    //console.log(1734, x, y);
    //console.log(1718, this.idsAr, this.tableLabels, this.tableColumns)
    // Which will  will want to manipulate this.tableColums
    /*
      // Currently we only support text fields
      e => {
        fieldLabel: String,
        fieldText: String
        rowId: String, // the _id of the document which provides the row data
        refDocId: String, // the refDocId of the counter supporting this
      }
    */

  }

  dateChanged(_id, event, _dateKey){
    //console.log(1962, arPos, value, label)
    console.log(1963, this.key, _id, event)
    this.service.updateDate(this.key, _id, _dateKey, moment(event).format("YYYY-MM-DD"))
      .subscribe(
        (data: any) => {
          this.tableDataChanged.emit( { date: moment(event).format("YYYY-MM-DD"), key: this.key, _id: _id} )
          // Here we will want to call a special API that changed the name of the folder inside of
          // the associated document and box folder
        },
        (error) => {
        })

  }

  dropdownItemRemoved($event){
    console.log(2059, $event);
     this.dropdownItemDeleted.emit($event);
  }

  onTextClicked($event, row, column){

    $event.stopPropagation();

    if(typeof this.textClickedRoutes == 'undefined')
      return;
    
    console.log(2192, $event, row, column);
    this.sharedService._variableData = { }
    this.sharedService._variableData[`${this.key}_id`] = this.idsAr[row]
    console.log(2196, this.sharedService)
    if(this.textClickedRoutes.length > 0){
      this.router.navigate([this.textClickedRoutes[column]])
    }
    //console.log(2193, this.idsAr[i]);
    //console.log(2194, this.idsAr[y]);

  }

  removeAllButtons(){
    this.buttonsAr = []
    this.buttonNamesAr = []
  }




  changeButton(row, oldName: string, newName: string){


    //console.log(2231, row, this.buttonNamesAr);


    //this.buttonNamesAr[row][0] = newName;

    //console.log(2237, row, this.buttonNamesAr);
    // this.buttonNamesAr[1][0] = "newName2";
    // this.buttonNamesAr[2][0] = "newName3";

    // this.buttonNamesAr[0][1] == "newName";
    // this.buttonNamesAr[1][2] == "newName2";
    // this.buttonNamesAr[2][3] == "newName3";

    //console.log(2240, this.buttonNamesAr)

    // var columns = this.columns.split(",")
    // //for(var i = 0; i < columns.length; i++){
    //   for(var y = 0; y < this.tableData.length; y++){
    //     console.log(2235, y, row, this.tableData.length, columns.length)
    //    if( y == row){

    //      for(var i = 0; i < this.buttonNamesAr.length; i++){

    //        if(this.buttonNamesAr[i][y] == oldName){
    //          this.buttonNamesAr[i][y] = newName;

    //          }
    //    }
    //  }
    //   }
    //}
    // for(var i = 0; i < this.buttonNamesAr.length; i++){
    //   if(this.buttonNamesAr[i] == oldName){
    //     this.buttonNamesAr[i] = newName
    //   }
    // }

  }

  addButton(row, buttonName: string, buttonColumn: string){
    console.log(2289, this.buttonsAr, this.buttonNamesAr);
    this.buttonsAr.push(buttonColumn)
    this.buttonNamesAr.push(buttonName)
  }

  removeButton(buttonName){
    var index = this.buttonsAr.indexOf(buttonName);
    this.buttonsAr.splice(index, 1)
    this.buttonNamesAr.splice(index, 1);
  }

  resizeColumn(columnPos, size){

    this.flexColumns.toArray().forEach(
        val => {
          var column = val.nativeElement.attributes["data-column"].value;
          if(column == columnPos){
            val.nativeElement.style=`width:${size}px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;`;
          }
        }
      );

    this.textColumns.toArray().forEach(
        val => {
          var column = val.nativeElement.attributes["data-column"].value;
          //console.log(2508, column)
          if(column == columnPos){
            val.nativeElement.style=`width:${size}px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;`;
          }
        }
      );
  }

  shrinkColumn(columnPos, size){
    console.log(2509, size);
    this.flexColumns.toArray().forEach(
        val => {
          var column = val.nativeElement.attributes["data-column"].value;
          if(column == columnPos){
            var newSize = val.nativeElement.style.width.substring(0, val.nativeElement.style.width.length - 2) - size;
            console.log(2515, newSize)
            val.nativeElement.style=`width:${newSize}px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;`;
          }
        }
      );

    this.textColumns.toArray().forEach(
        val => {
          var column = val.nativeElement.attributes["data-column"].value;
          //console.log(2508, column)
          if(column == columnPos){
            var newSize = val.nativeElement.style.width.substring(0, val.nativeElement.style.width.length - 2) - size;
            console.log(2527, newSize)
            val.nativeElement.style=`width:${newSize}px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;`;
          }
        }
      );
  }

  mouseDown$: Observable<any>;
  mouseUp$: Observable<any>;

@ViewChild('tablecontainer', { static: false }) el: ElementRef;

  ngAfterViewInit() {
    this.resetWidths()
    //this.mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown').pipe(tap(console.log));
    //this.mouseUp$ = fromEvent(this.el.nativeElement, 'mouseup').pipe(tap(console.log));
  }

  // The purpose of this code is to allow us to dynamically resize a row
  // Work in progress.  Started Tue Mar 15
  // Plan is to make columns dynamically resizable
  
  mouseDownClickedAt = 0
  mouseUpClickedAt = 0
  mouseDownElement
  mouseUpElement

  onClick($event) {

      return;
    this.mouseDownClickedAt = Date.now();
    this.mouseDownElement = $event;
  }

  onMouseUp($event) {

      return;

      this.mouseUpElement = $event;
      this.mouseUpClickedAt = Date.now();
      var timeLapse = this.mouseUpClickedAt - this.mouseDownClickedAt;

      // If the user interaction was less than 250 milliseconds then we do nothing
      if(timeLapse < 251){
        return;
      }

      // Check and see if the original mouseDownElement was a draggable element

      console.log(2543, this.mouseUpElement.srcElement.className)

      if((this.mouseUpElement.srcElement.className == "flexheader")||(this.mouseUpElement.srcElement.id == "div4")||(this.mouseUpElement.srcElement.className == "flexicon-header")){
        // We have a long click event in our target resize area
      //console.log(2543, $event.clientX - this.mouseDownElement.clientX)

      var resizeFactor = $event.clientX - this.mouseDownElement.clientX
      // Positive means they moved the mouse left, negative right

      if(resizeFactor < 0){
         console.log(2549, $event.offsetX)
        //this.resizeColumn(5, $event.offsetX)
        this.shrinkColumn(5, resizeFactor)
        return;
      }

      console.log(2550, $event.pageX)
      console.log(2551, $event.screenX)
      console.log(2552, $event.x)
      }
}

    bShowDatePicker: Boolean = false;
    showDatePicker() {
      console.log(2637, "show date picker");
      this.bShowDatePicker = !this.bShowDatePicker
    }

  // End Work In Progress

}
