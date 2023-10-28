import { Component, OnInit, SimpleChanges, ElementRef, ViewChildren } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Input, ViewEncapsulation } from '@angular/core';
import { FlexibleTableService } from '../flexible-table/services/flexible-table-service';
import { distinct } from 'rxjs/operators';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/environment';
import { map, take, catchError } from 'rxjs/operators';
import { FormsModule, NgForm, FormArray } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
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
/* Import all of the services from the services folder */

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';

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
  @Input() displaySearch: boolean = true;
  @Input() displayFileUpload: boolean = true;
  @Input() displayAddDataToSource: boolean = true;
  @Input() displayPageLength: boolean = true;
  @Input() displayPagination: boolean = true;
  @Input() displayDelete: boolean = true;
  @Input() displayClone: boolean = true;
  @Input() displayExport: boolean = true;
  @Input() displayFullLines: boolean = true;
  @Input() isDraggable: boolean = false;
  @Input() displayHeaders: boolean = true;
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
  buttonsAr: Array<string> = [];
  @Input() buttonNames: string = "";
  @Input() all = "";
  @Input() filter = "";
  @Input() headerIcons: string = ""
  @Input() headerIconNames: string = "";
  @Input() tableIcons: string = ""
  @Input() tableIconNames: string = "";
  @Input() filters: string = ""
  @Input() aggregate: string = ""
  @Input() noTextColumns: string = "";
  @Input() menuColumns: string = "";
  @Input() widths: string = "";
  @Input() deleteOnDrop = false;
  @Input() linkColumns: string = ""
  @Input() viewSelectColumns: string = ""
  @Input() sortableColumns: string = ""
  @Input() customColumns: string = "" 
  @Input() customRoute: string = ""

  @ViewChildren('cell') flexCells;
  @ViewChildren('column') flexColumns;
  @ViewChildren('selectColumn') selectColumns;
  @ViewChildren('textColumn') textColumns;
  @ViewChildren('dateColumn') dateColumns;
  @ViewChildren('flexdropdown') flexDropDowns;


  widthsAr: Array<any> = [];
  filtersObj: any;
  aggregateObj: any;
  filtersAr: Array<any> = [];
  filterLabelsAr:Array<any> = [];

  ngOnChanges(changes: SimpleChanges){
   // Extract changes to the input property by its name
   } 

  headerIconNamesAr: Array<string> = [];
  headerIconsAr: Array<string> = [];
  tableIconNamesAr: Array<string> = [];
  tableIconsAr: Array<string> = [];
  customColumnsAr:Array<string> = [];

  dragdropAr: Array<string> = []
  buttonNamesAr: Array<string> = []
  headerButtonsAr: Array<string> = []
  menuColumnsAr: Array<string> = []
  displayIconHeader: Array<boolean> = [];
  testDrag: boolean = true;
  viewSelectsAr: Array<boolean> = [];
  viewSelectColumnsAr: Array<string> = []
  sortableColumnsAr: Array<string> = []
  noTextColumnsAr: Array<boolean> = []
  columnsAr: Array<string> = [];

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

  test5(){
    
    //this.getInitialDataTableList(this.max_records);
  }

  onChangeMaxRecord(maxrecords: any) {
    this.max_records = maxrecords;
    this.getInitialDataTableList(maxrecords);
  }

  refreshTableData(){
    this.getInitialDataTableList(this.max_records);
  }

  currencyColumnsAr: Array<string> = [];

  ngOnInit() {

    //console.log('get ngOnInit')
    //console.log(163, this.tableColumns);
    this.tableColumns = [];

    if(this.buttons.length > 0){
      this.buttonsAr = this.buttons.split(",");
      this.buttonNamesAr = this.buttonNames.split(",")
    }

    if(this.menuColumns.length > 0){
      this.menuColumnsAr = this.buttons.split(",");
    }

    if(this.widths.length > 0){
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

    if(this.currencyColumns.length > 0){
      this.currencyColumnsAr = this.currencyColumns.split(",");
    }

    if(this.dragdrop.length > 0){
      this.dragdropAr = this.dragdrop.split(",");
    }

    if(this.headerButtons.length > 0){
      this.headerButtonsAr = this.headerButtons.split(",");
    }

    if(this.tableIcons.length > 0){
      this.tableIconsAr = this.tableIcons.split(",");
      this.tableIconNamesAr = this.tableIconNames.split(",");
    }

    if(this.headerIcons.length > 0){
      this.headerIconsAr = this.headerIcons.split(",");
      this.headerIconNamesAr = this.headerIconNames.split(",");
    }

    if(this.columns.length > 0){
      this.columnsAr = this.columns.split(",");
      for(var i = 0; i < this.columnsAr.length; i++){
        this.noTextColumnsAr.push(false);
      }
    }

    if(this.viewSelectColumns.length > 0){
      this.viewSelectColumnsAr = this.viewSelectColumns.split(",");
      for(var i = 0; i < this.viewSelectColumnsAr.length; i++){
        console.log(257, this.viewSelectColumnsAr[i])
      }
    }

    if(this.sortableColumns.length > 0){
      this.sortableColumnsAr = this.sortableColumns.split(",");
      for(var i = 0; i < this.sortableColumnsAr.length; i++){
        console.log(257, this.sortableColumnsAr[i])
      }
    }

    if(this.customColumns.length > 0){
      this.customColumnsAr = this.customColumns.split(",");
      console.log(270, this.customColumnsAr);
    }

    if(this.noTextColumns.length > 0){
      var notextAr = this.noTextColumns.split(",");
      for(var i = 0; i < notextAr.length; i++){
        for(var y = 0; y < this.columnsAr.length; y++){
          if(notextAr[i] == this.columnsAr[y]){
            this.noTextColumnsAr[y] = true;
          }
        }
        //if(this.columnsAr[i])
      }
    }

    for(var i = 0; i < this.tableColumns.length; i++){
      this.noTextColumnsAr.push(false);
    }

    this.checkIfViewSelect()

    this.getInitialDataTableList();
    this.initAddDataToSourceForm();

    if(this.dragAccept.length > 0){
      // This is a string, convert it into an array
      this.dragAccept = this.dragAccept.split(",");
    }

    this.sendHeaderButtons.emit(this.headerButtons);
    this.sendTableButtons.emit(this.buttonNames);
    
    if(this.filters.length > 0){
      this.filtersObj = JSON.parse(this.filters);
    }
    
    if(this.aggregate.length > 0){
      //this.aggregate = btoa(this.aggregate)
      //console.log(319, this.aggregate)
    }

    if(Array.isArray(this.filtersObj)){
      // Check and make sure this has become a proper array
      
      for(var i = 0; i < this.filtersObj.length; i++){
        // Put our filters into an array
        this.filtersAr.push(this.filtersObj[i].filter)   
        this.filterLabelsAr[i] = [] 
        this.filterLabelsAr[i].push(this.filtersObj[i].label)

          this.service.getFilterOptions(this.filtersObj[i]).subscribe(
              (data: any) => {   
                 
                 for(var y = 0; y < this.filtersObj.length; y++){
                     if(this.filtersObj[y].datasource == data.datasource){
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
  checkIfViewSelect(){
    for(var i = 0; i < this.columnsAr.length; i++){
      this.bDropDownViewsAr[i] = false;
    }

    for(var i = 0; i < this.viewSelectColumnsAr.length; i++){
      for(var y = 0; y < this.columnsAr.length; y++){
        if(this.columnsAr[y] == this.viewSelectColumnsAr[i]){
          this.bDropDownViewsAr[y] = true;
        }
      }
      //var colName = this.viewSelectColumnsAr[i];
    }

   // console.log(372, this.bDropDownViewsAr);
    this.makeBooleanArray(this.bSortableColumnsAr, this.sortableColumnsAr)
    this.MakeBooleanArray(this.bCustomColumnsAr, this.customColumnsAr)
    this.makeBooleanArray(this.bUp, this.sortableColumnsAr)

  }

   MakeBooleanArray(bArray: Array<boolean>, sArray){
    for(var i = 0; i < this.columnsAr.length; i++){
      bArray.push(false);
    }

    for(var i = 0; i < sArray.length; i++){
    if(sArray[i].length > 0){
      bArray[i] = true;
    }}
    // for(var i = 0; i < sArray.length; i++){
    //     for(var y = 0; y < this.columnsAr.length; y++){
    //       if(this.columnsAr[y] == sArray[i]){
    //         bArray[y] = true;
    //       }
    //     }
    //   }    
  }

  makeBooleanArray(bArray: Array<boolean>, sArray){
    for(var i = 0; i < this.columnsAr.length; i++){
      bArray.push(false);
    }

    for(var i = 0; i < sArray.length; i++){
        for(var y = 0; y < this.columnsAr.length; y++){
          if(this.columnsAr[y] == sArray[i]){
            bArray[y] = true;
          }
        }
      }    
  }

    ngAfterViewInit(){

      // console.log(294, "Do my @ViewChildren Modifications Here");
      // console.log(197, this.flexColumns);
      //console.log(332, this.flexColumns.toArray().length)

    this.flexColumns.changes.subscribe(() => {
      var tmp = 0;
       this.flexColumns.toArray().forEach(
       val => {
         for(var i = 0; i < this.widthsAr.length; i++){
           if(i == tmp){
             val.nativeElement.style = `width:${this.widthsAr[i]}px;`;
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
          tmp++;
          if(tmp > this.tableData.length)
            tmp = 1;
        });
    });

    this.setColumnWidth(this.textColumns);
    this.setCustomClasses(this.flexColumns)
  }


setCustomClasses(column){
  return;
      column.changes.subscribe(() => {
          var tmp = 1;
          column.toArray().forEach(
            val => {
                var columnNum = val.nativeElement.attributes["data-column"].value;
                //val.nativeElement.style = `width:${this.widthsAr[columnNum]}px;`;
                
                if(this.bCustomColumnsAr[columnNum] == true){
                  val.nativeElement.classList.add(this.customColumnsAr[columnNum]);
                  
                }

                tmp++;
                if(tmp > this.tableData.length)
                  tmp = 1;
            });
        });
  }

  setColumnWidth(column){
      column.changes.subscribe(() => {
          var tmp = 1;
          column.toArray().forEach(
            val => {
                var columnNum = val.nativeElement.attributes["data-column"].value;
                val.nativeElement.style = `width:${this.widthsAr[columnNum]}px;`;
                
                tmp++;
                if(tmp > this.tableData.length)
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

  getInitialDataTableList(maxrecords = 0) {

    var getRecords = this.max_records;
    if(this.displayRecord != 10){
      getRecords = this.displayRecord-1;
      this.max_records = getRecords;
    } else {
      this.max_records = 10;
    }

    

    var aggregate: any = false;
    if(this.aggregate.length > 0){
      aggregate = this.aggregate;
    }

    this.service.getInitialDataTableList(this.key, getRecords, this.columns, this.all, 
      this.filter, "", aggregate).subscribe(
      (data: any) => {  
        console.log(556, "refreshTableData", data);
        if(data.Error != 0){
          // Nothing to do display;
          //this.bNoData = true;
          this.tableData = [];
          //this.dataSource_list = []
          //this.table_Header = []
          //this.tableHeaders = []
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
        //console.log(343, data["pagination"]);
        this.pagination = data["pagination"];
        this.addDataForm_value = this.formDefinitions
        this.jsonToArray();
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
      })
  }

  createAddDataToSourceForm() {
    // Request the first page
    // Look at the first record returned
    // Deduce from that what the add data to source form should look like
  }

  // getting value form list by pagination
  loadingDataTablePagination(url) {
    this.service.loadingDataTablePagination(url, this.columns).subscribe(
      (data: any) => {
        this.dataSource_list = data[this.key];
        this.table_Header = data.headers;
        this.addDataForm_value = data.addDataForm
        this.tableHeaders = data.headers;
        this.tableData = data[this.key]
        this.formDefinitions = data["addDataForm"];
        //console.log(343, data["pagination"]);
        this.pagination = data["pagination"];
        this.jsonToArray();
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

  //  data delete by id
  deleteById(datasource_id) {
    this.service.deleteById(datasource_id).subscribe(
      (data: any) => {
        this.getInitialDataTableList();
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
      this.service.searchValueInList(this.searchvalue, this.key, this.header).subscribe(
        (data: any) => {
          this.dataSource_list = data[this.key];
          this.tableHeaders = data.headers;
          this.tableData = data[this.key]
          this.formDefinitions = data["addDataForm"];
        }
      )
    }

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
      this.excel_file_Error = "invalid file Formatn";
      return;
    } else {
      this.excel_file_Error = "";
      this.excel_file_Info = "Chosen File Name: " + file.name;
      this.excelFileData = file;

      this.excel_loaded = false;
      reader.onload = this.excelIsloaded.bind(this);
      reader.readAsDataURL(file);
    }
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

    if(this.filter.length > 0){
      params = this.filter;
    }

    this.service
      .uploadExcelFile(this.excelFileData, params)
      .subscribe(
        (data: any) => {
          if (data.Error === 505) { } else {
            this.excel_loaded = false;
            this.uploading = false;
            this.excel_file_Info = "File uploaded successfully!";
            this.getInitialDataTableList();

          }
        },
        error => {
          this.excel_loaded = false;
          this.excel_file_Info = "";
          this.excel_file_Error = "File dropped! Please reselect file!";
        });
  }

  // Open close  data source popup
  opendataSource = true;
  addfile = true;

  openDataSource() {
    this.opendataSource = !this.opendataSource
    this.addfile = true;
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
  }

  // Open close file upload popup
  openFileUpload() {
    this.addfile = !this.addfile
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
  }

  closeFileUpload() {
    this.addfile = true
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

    console.log(1034, "addItems Called");

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
        this.addDynamicElement.addControl(
          this.addDataForm_value[i].field_name,
          new UntypedFormControl(
            ''
          )
        );
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
  onSubmitDatasourceFormDynamic(form:any) {

    var addDataToSourceFormValue = form
    this.submitted = true;
      this.service.addDataToSourceForm(addDataToSourceFormValue.value)
        .subscribe(
          (data: any) => {
            //this.addsourceTest = 'Sucessfully added';
            //this.getDataSourceValueKey();
            this.closeDataSource()
            this.getInitialDataTableList();
            //this.addDynamicElement.controls.value = null
          },
          (error) => {
            // this.errorFound = true
            // this.errorMessage = error
            // this.openSnackBar("Payment Method Delete Failed!", "snackbar-class-warning")
          })
    

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
    //console.log(898, this.tableData)
    var tableRows = this.tableData;
    this.idsAr = [];
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

        for(var u = 0; u < this.currencyColumnsAr.length; u++){
          if(this.currencyColumnsAr[u] == rowKeys[y]){
            row[rowKeys[y]] = this.currencySymbol + String(row[rowKeys[y]]);
          }
        }
        
        var cell = row[rowKeys[y]];
        try {
          iconColumns[y].push(cell.split(","));
        } catch(err){
          iconColumns[y].push([]);
        }

        if(cell.length > this.maxCharacters){
            cell = cell.substring(0, this.maxCharacters)
            // add icon here
        }
        
        if(cell.length == 0){
          cell = "0"
        }
        
        tableColumns[y].push(cell)
      }
      this.transferArray.push(rowobj);
      }
    

    for(var i = 0; i < tableColumns.length-1; i++){
      this.dragallows.push(false);
    }

    for(var i = 0; i < this.tableHeaders.length; i++){
      for(var y = 0; y < this.dragdropAr.length; y++){
        if(this.dragdropAr[y] == this.tableHeaders[i]){
          this.dragallows[i] = true;
        }
      }
    }
    this.tableColumns = tableColumns
    this.iconColumns = iconColumns;
    this.addItems();
    if(this.tableColumns.length >= 1){
      this.test = this.tableColumns[1];
    }

    //console.log(954, this.tableColumns);
  }

  replaceItemInArray(arrItem, currentIndex) {

  }

  drop(event: any, column) {
      this.dropListExited(event, null);
      
      // Get the _id of the document.
      var currentRow = event.currentIndex;
      var data = this.tableData[currentRow]
      console.log(1015, this.tableColumns);
      var rowPos = event.previousIndex;
      var droppedObj = event.previousContainer.data[rowPos]
      //console.log(1154, currentRow, rowPos);
      //droppedObj._id = data._id;
     console.log(1166, droppedObj);
      console.log(1011, event.previousContainer.data, rowPos)
      var addObject = droppedObj
      // This is a hack
      if(typeof droppedObj.skills != 'undefined'){
        addObject = droppedObj.skills;
      }
      if(typeof droppedObj.description != 'undefined'){
        addObject = droppedObj.description;
      }

      if(Array.isArray(this.tableColumns[column][currentRow]))
        this.tableColumns[column][currentRow].push(addObject)
      this.receivedDropItem.emit({
        _id: data._id,
        data: droppedObj,
        column: column,
        row: currentRow
      });
  }

  dynamicButtonClicked(event: any, r, y){
    
    var thisAr = [];
    for(var i = 1; i < this.tableColumns.length; i++){
      if(Array.isArray(this.tableColumns[i][r])){
         thisAr.push(this.tableColumns[i][r][0])  
      } else {
      thisAr.push(this.tableColumns[i][r])
      }
    }
    var row = {}
    for(var i = 0; i < this.columnsAr.length; i++){
      row[this.columnsAr[i]] = thisAr[i]
    }

    this.service.dynamicButton(this.key, event.srcElement.id, event.srcElement.name, row).subscribe(
        (data: any) => {
          // Display a popup here of the button results
          data.actions["_id"] = event.srcElement.id;
          data.actions["key"] = this.key;
          data.actions["button"] = event.srcElement.name;
          data.actions["row"] = data.row;
          this.tableBtnClicked(data.actions);
        }
      )
  }

  @Output() onHeaderButtonClicked = new EventEmitter<string>();
  @Output() sendHeaderButtons = new EventEmitter<string>();
  @Output() sendTableButtons = new EventEmitter<string>();
  @Output() tableButtonClicked = new EventEmitter<object>();
  @Output() iconClicked = new EventEmitter<object>();
  @Output() headerDropdownChanged = new EventEmitter<object>();
  @Output() receivedDropItem = new EventEmitter<object>();
  

  onIconClicked(event){
    this.iconClicked.emit(event);
  }

  onHeaderBtnClicked(btnName) {
    this.onHeaderButtonClicked.emit(btnName);
  }

  tableBtnClicked(response) {
    this.tableButtonClicked.emit(response);
  }

  // onHeaderDropdownChanged(dropdownData){
  //   this.headerDropdownChanged.emit(dropdownData);
  // }

  displayIconTooltip(event, column, icon){
  
  }

   hideIconTooltip(event){
   }

   onFilterSelected(filter, value){

     var dropdownData = {
       "filter":"filter",
       "value":value
     }

     this.headerDropdownChanged.emit(dropdownData);
     var filterObj = this.filtersObj[filter];
     if(filterObj.filter == false){
      // The purpose here is a simple dropdown...notify the parent controller
       console.log(1060, value);
       return; 
     }

     var mongoFindQuery = filterObj.filter;
     mongoFindQuery[filterObj.key] = value;
     this.filter = JSON.stringify(mongoFindQuery);
     this.getInitialDataTableList(this.max_records);
   }

   currentCoord = {
     x: 0, 
     y: 0
   }

   test1: Array<boolean> = [false,false,false,false,false,false,false,false];

   onHoverColumn(status: boolean, columnIndex){
     if(status == true){
       this.currentCoord.y = columnIndex
       //if(this.currentCoord.x != 0)
         //if(columnIndex == 2)
         //this.test1[columnIndex] = true;

     } else {
        this.currentCoord.y = 0; 
     }
   }

   onHoverRow(status: boolean, rowIndex, event =null){
     rowIndex = rowIndex + 1
     if(status == true){
       if(this.currentCoord.y == 4){

         this.test1 = [false,false,false,false,false,false,false,false];
       }
       this.test1[rowIndex-1] = true;
       this.currentCoord.x = rowIndex
 
       //if(this.currentCoord.y != 0)
       //event.srcElement.style.backgroundColor = "green"
     } else {
       if((this.currentCoord.y+1) != this.tableColumns.length)
         this.test1[rowIndex-1] = false;
       //this.test1[rowIndex] = false;
       this.currentCoord.x = 0
     }
   }

   onDropdownChange(value, y, i){
     var cell = this.tableColumns[0]
     this.swap(this.tableColumns[y][i], this.tableColumns[y][i].indexOf(value), 0)
   }

   swap(input, index_A, index_B) {
    let temp = input[index_A];
 
    input[index_A] = input[index_B];
    input[index_B] = temp;
}

  Page(endpoint: string){
      this.nextURL;
      console.log(endpoint);
      this.loadingDataTablePagination(endpoint); 
  }

  selectCellClass(bNoText: boolean, row){

    var currentRow = this.tableHeaders[row]
    for(var i = 0; i < this.tableIconsAr.length; i++){
      var iconColumnName = this.tableIconsAr[i];
      if(this.noTextColumns.indexOf(iconColumnName) != -1){
        if(currentRow == iconColumnName)
          return "flexrow_span_empty";
      }
      if(currentRow == iconColumnName){
        return "flexrow_span";
      }
    }
    return "flexrow_span_notext";
  }

  selectColumnClass(compact: boolean, noTextColumn: boolean){
    if(compact == true){
      return "flexrow-compact"
    }  

    if(noTextColumn == true){
      return "flexrow_notext";
    }

    return "flexrow";

  }
  //   var currentRow = this.tableHeaders[row]
  //   for(var i = 0; i < this.tableIconsAr.length; i++){
  //     var iconColumnName = this.tableIconsAr[i];
  //     if(this.noTextColumns.indexOf(iconColumnName) != -1){
  //       if(currentRow == iconColumnName)
  //         return "flexrow_span_empty";
  //     }
  //     if(currentRow == iconColumnName){
  //       return "flexrow_span";
  //     }
  //   }
  //   return "flexrow_span_notext";
  // }

  setdate(date){
    var rval = new UntypedFormControl(new Date(Date.parse(date)))
    //var rval = new Date(Date.parse(date))
    //date = rval;
    return rval;
  }

  editField(){
    console.log(1196, "Double Click")
  }

  sorted($event){
    console.log(1200, "Sorted")
  }

  dragDropEntered($event, column, row){
    //console.log(1210, "dragDtopEntered", column, row)
    // console.log(1211, this.tableColumns[column].pop());
  }

  dragDropExited($event){
    //console.log(1210, "dragDropExited")
  }

  dragDrop($event){
    console.log(1218, "dragDrop")
  }

  dragDropMove($event){
    console.log(1218, "dragDropMove")
  }

  dragDropSort($event){
    console.log(1218, "dragDropSort")
  }

  temp: any = []

  dropListEntered($event, column){
    if(this.bDropExitedFirst == true){
      this.bDropExitedFirst = !this.bDropExitedFirst
      return;
    }
    this.bDropExitedFirst = !this.bDropExitedFirst
    var columns =0, rows =0;
    columns = this.tableColumns.length;
    if(this.tableColumns.length>=2){
      rows = this.tableColumns[1].length;
   }
    columns--;
     this.flexCells.toArray().forEach(
       val => {
         var cell = val.nativeElement.attributes["data-count"].value;
         if(cell == (columns*rows)){
           val.nativeElement.style = "display:none"
         }
       }
       );
  }

  bDropExitedFirst: boolean = false;
  dropListExited($event, column){
    if(this.bDropExitedFirst == false){
      this.bDropExitedFirst = !this.bDropExitedFirst
      return;
    }
    this.bDropExitedFirst = !this.bDropExitedFirst
    var columns =0, rows =0;
    columns = this.tableColumns.length;
    if(this.tableColumns.length>=2){
      rows = this.tableColumns[1].length;
   }
    columns--;
     this.flexCells.toArray().forEach(
       val => {
         var cell = val.nativeElement.attributes["data-count"].value;
         if(cell == (columns*rows)){
           val.nativeElement.style = ""
         }
       }
       );
  }

  sorting($event, column){
    //console.log(1247, "Sorting", $event, column)

  }

  columnClicked(column){
  }

  bUp: Array<boolean> = [];
  headerClicked($event, headerPos, test){

    console.log(1491, this.bUp);
    if(this.bSortableColumnsAr[headerPos] == false){
      // initiate a sort against this column
      return;

    } 

    var sortKey = this.tableHeaders[headerPos];
    var sortBy = "";
    
    if(this.bUp[headerPos]){
      sortBy = "asc"
    } else {
      sortBy = "desc"
    }
    this.bUp[headerPos] = !this.bUp[headerPos]

    var getRecords = this.max_records;
    
    var sort = { }

    sort[sortKey] = sortBy

    // border-bottom: 5px solid #2f2f2f;
    this.service.getInitialDataTableList(this.key, getRecords, this.columns, this.all, 
      this.filter, JSON.stringify(sort)).subscribe(
      (data: any) => {  
        if(data.Error != 0){
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
        this.jsonToArray();
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
      })
  }




  onDragMouseOver($event){
    if($event.buttons > 0){
      // We're dragging?
      //console.log(1452, $event)
       //console.log(1453, $event.srcElement.attributes.name.value)
      if(typeof $event.srcElement.attributes != 'undefined'){ 
        if(typeof $event.srcElement.attributes.name != 'undefined'){
          if(typeof $event.srcElement.attributes.name.value != 'undefined'){
      if($event.srcElement.attributes.name.value == "hideOnDrag"){
        //console.log(1454, "Got here!");
        //$event.srcElement.innerHTML = "&nbsp;";
        //console.log(1450, "onDragMouseOver", $event.type, $event.srcElement.style);
      }
    }}}
  }
  }

  onDragMouseLeave($event){
    if($event.buttons > 0){
      // We're dragging?
      //console.log(1452, $event)
       //console.log(1453, $event.srcElement.attributes.name.value)
       if(typeof $event.srcElement.attributes != 'undefined'){
         if(typeof $event.srcElement.attributes.name != 'undefined'){
            if(typeof $event.srcElement.attributes.name.value != 'undefined'){
      if($event.srcElement.attributes.name.value == "hideOnDrag"){
        //console.log(1454, "Got here!");
        //$event.srcElement.innerHTML = "Back";
        //console.log(1450, "onDragMouseOver", $event.type, $event.srcElement.style);
      }}}}
    }
  }

  onDragOver($event){
    return;
    console.log(1454, "onDragOver", $event.type);
  }

  onDragStart($event){
    console.log(1455, "onDragStart", $event);
  }

  onDragEnd($event){
    console.log(1460, "onDragEnd", $event.type);
  }

  dragEnter(from){
    
    if(from == 14){
      return;
    }
    console.log(1506, from);
  }

  onResized($event){
    console.log(1514, "$event");

  }
}
