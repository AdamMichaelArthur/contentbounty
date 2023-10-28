import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray
  
} from '@angular/cdk/drag-drop';
import {
  MatCheckboxModule
} from '@angular/material/checkbox';
import {
  FlexibleComponent
} from '../flexible-table/flexible-table.component';
import {
  FlexibleTableService
} from '../flexible-table/services/flexible-table-service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormArray,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import {
  SiteAdminService
} from './siteadmin-home-service';

import { BaseService } from '../base/base.service'
import { BaseComponent } from '../base/base.component';
import { SharedService } from '../../_services/shared.service'
import { Router, CanActivate } from '@angular/router';

@Component({
  selector: 'siteadmin-home',
  templateUrl: './siteadmin-home.component.html',
  styleUrls: ['./siteadmin-home.component.css']
})
export class SiteadminHomeComponent extends BaseComponent implements OnInit {

    
  form: UntypedFormGroup;
  key: any = "salma";
  viewMode = 'skills'
  headerButtons = "Add Step,Add Task,Add Skill,Add Stage,Add Content Type,Add Files"
  constructor(
    private flexService: FlexibleTableService, public siteService: SiteAdminService,
    formBuilder: UntypedFormBuilder,
    fb: UntypedFormBuilder,
    public service: BaseService,
    public elementRef: ElementRef,
    private router: Router,
    public sharedService: SharedService
  ) {
    super(service, elementRef)
    this.form = new UntypedFormGroup({
      checkArray: new UntypedFormControl([], [Validators.required])
    })
  }

  refreshTable() {
    this.flexTable.getInitialDataTableList()
  }

  filters = [
    {
      "filter": { "content_type": "Too Cute For Me" },
      "label": "Content Type",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "steps",
      "key": "content_type",
      "distinct": "content_type"
    },
    {
      "filter": { "step": "Anything" },
      "label": "Step",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "step",
      "key": "step",
      "distinct": "step"
    }
  ]

  ngOnInit() {
    super.ngOnInit()
  }
  textCutoff = [20, 25, 25]

  // get step data 
  task_array = []
  skill_array = []

  getInitStep() {
    this.siteService.getInitStep('step').subscribe(
      (data: any) => {
        this.steps_array = data.step
        console.log(data);
      })
  }

  getInittask() {
    this.siteService.getInitTask('task').subscribe(
      (data: any) => {
        this.task_array = data.task
        console.log(data);
      })
  }

  getInitskill() {
    this.siteService.getInitTask('skill').subscribe(
      (data: any) => {
        this.skill_array = data.skill
        console.log(data);
      })
  }

  // Step label


  onBlurMethodpress(value: any) {
    if (this.add_description === '') {
      this.error_des = true;
    } else {
      this.error_des = false;
    }
    console.log(this.add_description)

    if (value == 'add_step_text_area') {

      if (this.add_step_text_area === '') {
        this.error_add_step_text_area = true;
      } else {
        this.error_add_step_text_area = false;
      }

    }


    if (value == 'task_des') {

      if (this.task_des === '') {
        this.task_des_error = true
      } else {
        this.task_des_error = false
      }

    }


    if (value == 'task_deatils_descrption') {
      if (this.task_deatils_descrption === '') {
        this.task_deatils_descrption_error = true
      } else {
        this.task_deatils_descrption_error = false

      }

    }


    if (value == 'skill_des') {

      if (this.skill_des === '') {
        this.skill_des_error = true
      } else {
        this.skill_des_error = false

      }
    }

    if (value == 'skill_details_descrption') {

      if (this.skill_details_descrption === '') {
        this.skill_deatils_descrption_error = true
      } else {
        this.skill_deatils_descrption_error = false

      }
    }


    if (value == 'skill_details_descrption') {

      if (this.skill_details_descrption === '') {
        this.skill_deatils_descrption_error = true
      } else {
        this.skill_deatils_descrption_error = false

      }
    }

    if (value == 'skill_lists') {
      if (this.skill_lists === []) {
        this.skill_lists_error = true
        console.log("from onblurpress 1" + this.skill_lists)
      }

      if (this.skill_lists != []) {
        this.skill_lists_error = false

        console.log("from onblurpress 2" + this.skill_lists)
      }
    }


    if (value == 'stage_name') {

      if (this.stage_name === '') {
        this.stage_name_error = true
      } else {
        this.stage_name_error = false

      }
    }

    if (value == 'content_name') {

      if (this.content_name === '') {
        this.content_name_error = true
      } else {
        this.content_name_error = false

      }
    }
  }

  onBlurMethod(value: any) {

    if (value == 'step_description') {
      this.error_des = true;
      if (this.add_description != '') {
        this.error_des = false
      }
    }

    if (value == 'add_step_text_area') {
      this.error_add_step_text_area = true;
      if (this.add_step_text_area != '') {
        this.error_add_step_text_area = false
      }
    }


    if (value == 'task_des') {
      this.task_des_error = true
      if (this.task_des != '') {
        this.task_des_error = false

      }
    }

    if (value == 'task_deatils_descrption') {
      this.task_deatils_descrption_error = true

      if (this.task_deatils_descrption != '') {
        this.task_deatils_descrption_error = false

      }
    }

    if (value == 'skill_des') {
      this.skill_des_error = true
      if (this.skill_des != '') {
        this.skill_des_error = false
      }

    }

    if (value == 'skill_details_descrption') {

      this.skill_deatils_descrption_error = true
      if (this.skill_details_descrption != '') {
        this.skill_deatils_descrption_error = false
      }

    }


    if (value == 'skill_details_descrption') {

      this.skill_deatils_descrption_error = true
      if (this.skill_details_descrption != '') {
        this.skill_deatils_descrption_error = false
      }

    }

    if (value == 'skill_lists') {
      this.skill_lists_error = true
      if (this.skill_lists.length != 0) {
        this.skill_lists_error = false
      }

      console.log("from onblur" + this.skill_lists)

    }


  }

  user_email_format_error = false
  // onContentTypeSelected($event){

  // }

  ValidateEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.user_email.match(mailformat)) {
      this.user_email_error = false
      this.user_email_format_error = false
      // return true;
    } else {
      this.user_email_error = false
      this.user_email_format_error = true
      // return false;
    }

    if (this.user_email == '') {
      this.user_email_error = true
      this.user_email_format_error = false

    }
  }

  ValidatePass() {
    if (this.user_password == '') {
      this.user_password_error = true
    }
    if (this.user_password != '') {
      this.user_password_error = false
    }

  }

  user_url_error_valid = false;
  ValidateUrl() {

    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (this.user_url == '') {
      this.user_url_error = true
    }
    if (!regex.test(this.user_url)) {
      this.user_url_error = false;
      this.user_url_error_valid = true

    }
    if (regex.test(this.user_url)) {
      this.user_url_error = false
      this.user_url_error_valid = false
    }

  }

  step_level: any = [
    "Require Native speaker", "Make this step Require", "Must be completed before Next Step",
    "Can be done Simultaneous", " Step produce digital Assets", "Step completes One or More Task"
  ]

  add_description: any = '';


  add_step_text_area: any = '';

  checkArray: any = [];
  checkArray1: any = [];
  onCheckboxChange(e) {
    if (e.target.checked) {
      this.checkArray.push(e.target.value);
    } else {
      var index = this.checkArray.indexOf(e.target.value);

      this.checkArray.splice(index, 1);

    }
    console.log(this.checkArray);


    if (e.target.checked) {
      this.checkArray1.push(e.target.value);
      console.log(this.checkArray1);
    }
    if (e.target.unchecked) {
      var index = this.checkArray1.indexOf(e.target.value);
      this.checkArray1.splice(index, 1);
    }

  }

  error: boolean = false;
  error_des: boolean = false;
  error_add_step_text_area: boolean = false;

  add_step() {
    if (this.add_description === '') {
      this.error_des = true
    }

    if (this.add_step_text_area === '') {
      this.error_add_step_text_area = true
    }
    if (this.add_step_text_area != '' && this.add_description != '') {

      this.error = false;
      this.error_des = false;
      this.error_add_step_text_area = false;
      var body = {
        step: this.add_description,
        requirment: this.checkArray,
        step_description: this.add_step_text_area,
        stage: this.stage,
        content_type: this.content_type,
        "skills":[],
        "stages": [],
        "tasks": [],
        "files":[],
      }

      this.siteService.addDataToSourceForm('step', body).subscribe(
        (data: any) => {
          console.log(data);
          this.add_description = '';
          this.add_step_text_area = '';
          this.checkArray = [];
          this.stage = '';
          this.content_type = '';
          this.getInitStep();
        })
    }

  }


  user_email = '';
  user_email_error = false
  user_password = '';
  user_password_error = false
  user_url = '';
  user_url_error = false
  require_login = false;
  require_login_error = false
  task_deatils_descrption = '';
  task_deatils_descrption_error = false;
  task_des = '';
  task_des_error = false;


  add_task() {

    console.log(this.require_login)

    if (this.require_login === false) {
      this.require_login_error = true
    }
    if (this.task_des === '') {
      this.task_des_error = true
    }

    if (this.task_deatils_descrption === '') {
      this.task_deatils_descrption_error = true
    }
    if (this.task_des != '' && this.task_deatils_descrption != '') {
      this.user_url_error = false
      this.user_email_error = false
      this.user_password_error = false

      this.task_deatils_descrption_error = false
      this.task_des_error = false
      this.require_login_error = false

      var body = {
        name: this.task_des,
        require_login: this.require_login,
        user_email: this.user_email,
        user_password: this.user_password,
        login_url: this.user_url,
        description: this.task_deatils_descrption,
      }
      console.log(body);
      this.siteService.addDataToSourceForm('task', body).subscribe(
        (data: any) => {
          console.log(data);
          this.task_des = ''
          this.require_login = false;
          this.user_email = '';
          this.user_password = '';
          this.task_deatils_descrption = '';

        })
    }

  }

  skill_details_descrption = '';
  skill_deatils_descrption_error = false;
  skill_des = '';
  skill_des_error = false;
  skill_lists_error = false

  add_skill() {

    if (this.skill_des === '') {
      this.skill_des_error = true
    }
    if (this.skill_details_descrption === '') {
      this.skill_deatils_descrption_error = true
    }
    if (this.skill_lists.length === 0) {
      this.skill_lists_error = true
    }

    if (this.skill_des != '' && this.skill_details_descrption != '' && this.skill_lists.length != 0) {
      this.skill_des_error = false;
      this.skill_deatils_descrption_error = false;
      this.skill_lists_error = false
      var body = {
        skills: this.skill_des,
        description: this.skill_details_descrption,
        skill_keywords: this.skill_lists
      }
      console.log(body);
      this.siteService.addDataToSourceForm('skill', body).subscribe(
        (data: any) => {
          console.log(data);
          this.skill_des = '';
          this.skill_details_descrption = '';
          this.skill_lists = []
        })
    }

  }

  add_asset() {}
  // 

  steps_array: any = []

  keywordInput: any


  deleteKeyword(steps_array, keyword) {
    console.log(keyword);
    console.log(steps_array);
    const index: number = this.steps_array.indexOf(steps_array);
    console.log(index)
    if (index !== -1) {
      console.log(this.steps_array[index].Keywords)
      const valueAtIndex = this.steps_array[index].step.indexOf(keyword);;
      this.steps_array[index].step.splice(valueAtIndex, 1)
      console.log("done")
      console.log(this.steps_array[index].step)
    }

  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(456, "drop", event);
    this.sharedService.drop(event);
  }

  editData(description, key, steps_array) {
    console.log(description)
    console.log(key)
    console.log(steps_array)
    var body = {
      key: key,
      value: description
    }
    this.siteService.editDataById(steps_array._id, body, 'step').subscribe(
      (data: any) => {
        console.log(data);
      })
  }

  flextableHeaderButtonClicked(buttonName: string) {
    super.flextableHeaderButtonClicked(buttonName)
    this.refreshTable()
  }

  dropItemReceived($event: any) {
    // _id: "5e8f1b43434b6de6e89eb0f1"
    // column: 3
    // dragType: "skills"
    // droppedData: "editing"
    // key: "skills"
    console.log(662, $event["dragType"], JSON.parse($event["droppedData"]));
    var droppedData = JSON.parse($event["droppedData"])
    var _id = $event["_id"];
    this.service.key = "steps"
    this.pushValueIntoArray(_id, $event["dragType"], droppedData.data, true);
  }


  skill_lists = [];
  addSkill(skill: string) {
    if (skill) {
      this.skill_lists.push(skill);
    }
    console.log(this.skill_lists)

    if (this.skill_lists.length === 0) {
      this.skill_lists_error = true
    }
  }

  remove(skill) {
    const index: number = this.skill_lists.indexOf(skill);
    if (index !== -1) {
      this.skill_lists.splice(index, 1);
    }
    console.log(this.skill_lists)
  }

  // adding step content type value getting 
  content_type = ''
  contentError = false
  onContentTypeSelected(value) {
    console.log(value);
    this.content_type = value;

    if (this.content_type === '') {
      this.contentError = true
    } else {
      this.contentError = false
    }
  }


  // adding step stage value getting 
  stage = ''
  stageError = false
  onContentTypeSelected_Stage(value) {
    console.log(value);
    this.stage = value;
    if (this.stage === '') {
      this.stageError = true
    } else {
      this.stageError = false
    }
  }

  // add stage button 
  stage_name: any = ''
  stage_name_error = false
  add_stage() {

    if (this.stage_name === '') {
      this.stage_name_error = true
    } else {
      this.stage_name_error = false
      var body = {
        "content_type": this.stage_name
      }

      this.siteService.addDataToSourceForm('content_types', body).subscribe(
        (data: any) => {
          console.log(data);
          this.stage_name = ''
        })
    }

  }

  onStage() {
    if (this.stage_name === '') {
      this.stage_name_error = true
      if (this.stage_name != '') {
        this.stage_name_error = false

      }
    }
  }

  blank_process = {
    "content_type" : "",
    "distribution_method" : [
      "Website,Platform,Document"
    ],
    "editorial_guidelines" : [
      "http://www.dropboxurl.com/link/to/editorial/guidelines/link1",
      "http://www.dropboxurl.com/link/to/editorial/guidelines/link2",
      "http://www.dropboxurl.com/link/to/editorial/guidelines/link3"
    ],
    "frequency" : [
      "Select Frequency",
      "2x Per Day",
      "3x Per Day",
      "4x Per Day",
      "Daily",
      "3x Per Week",
      "Weekly",
      "2x Per Month",
      "Monthly"
    ],
    "media_type" : "text",
    "process_description" : "",
    "selected" : false,
    "short_description" : "",
    "starting_day" : [
      "Select Day",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "suggested_bounty" : 125,
    "suggested_video_length" : 5,
    "suggested_word_count" : 1800,
  }

  // add content type button
  content_name: any = ''
  content_name_error = false
  add_conten() {

    var body = this.blank_process;

    if (this.content_name === '') {
      this.content_name_error = true
    } else {
      this.content_name_error = false
      body.content_type = this.content_name

      this.siteService.addDataToSourceForm('process', body).subscribe(
        (data: any) => {
          console.log(731, data);
          this.content_name = ''
        })
    }

  }

  file_name: any = '';
  file_name_error = false;

  add_files() {
    if (this.file_name === '') {
      this.file_name_error = true
    } else {
      this.file_name_error = false
      var body = {
        "file_name": this.file_name
      }
      this.siteService.addDataToSourceForm('file_type', body).subscribe(
        (data: any) => {
          console.log(data);
          this.file_name = ''
        })
    }

  }

  onContent() {
    if (this.content_name === '') {
      this.content_name_error = true

      if (this.content_name != '') {
        this.content_name_error = false

      }
    }
  }

  dragFrom: string = "";

  dragStart(ev, dragType, data) {
    console.log(840, "Drag Start")
    ev.target.id = "taskid";
    if(dragType == 'add_keyword'){
      this.dragFrom = "keywords"
    }
    if(dragType == 'add_title'){
      this.dragFrom = "titles"
    }
    if(dragType == 'add_prompt'){
      this.dragFrom = "prompts"
    }
    var dropOriginData = {
      dragType: dragType,
      droppedData: data
    }
    
    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("dropOriginData", JSON.stringify(dropOriginData));
  }

  onDragStart(ev, dragType){
    var data = ev.dataTransfer.getData('data');  
    this.dragFrom = dragType; 
    console.log(862, data, dragType)
    ev.target.id = "taskid";
    this.dragFrom = dragType;

    var dropOriginData = {
      dragType: dragType,
      droppedData: data
    }
    
    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("dropOriginData", JSON.stringify(dropOriginData));

  }

  onDragEnd(e){
    console.log(403, "onDragEnd");
    this.dragFrom = "";
  }

  onDragEnter(e){
    console.log(870, e);
    //console.log(407, "onDragEnter");
  }
  
  onDragLeave(e){

    //console.log(411, "onDragLeave");
  }
  
  onDragOver(e){
    console.log(878, this.dragFrom, e.key);
    if(this.dragFrom == e.key){
      e.event.preventDefault();  
    }
  }
  
  onDropEvent(e){
    //e.preventDefault();
    console.log(419, "onDropEvent");
  }


  // drag and drop by salma 
  bounty_createv2 = false
  currentBounty: any = {}
  tableButtonClicked($event){
    this.response = $event;
    console.log("SAlMA", this.response);
    if($event.button=='Edit'){
      this.content_type = $event.content_type;
      this.currentBounty = $event.bounty;

      this.bounty_createv2 = true
      return;
    }
  }
  disapparePopup(){
    this.bounty_createv2 = false
  }

  total_bounty: number = 0;

  reset(){
    this.total_bounty = 0;

  }
  bountyTemplate: Array<any> = [];
  currentBrand: any = "";
  currentBrandId: any = "";
  brands = [];
  addGuide($event){
    this.reset();

    console.log(378, this.currentBounty);


    console.log(381, 'Add Guide Called', $event)


    console.log(430, this.currentBounty)
    this.currentBounty.brand_name = this.currentBrand;


    const addProcess = $event
    var brand_id = 0

    console.log(152, this.brands);
    for(var i = 0; i < this.brands.length; i++){
      if(this.brands[i].brand_name == this.currentBrand){
        brand_id = this.brands[i]["_id"]
      }
    }
    
    console.log(448, addProcess)
    addProcess[0]["bounty"] = this.currentBounty
    addProcess[0]["bounty"]["brand_id"] = brand_id
    console.log(450, addProcess[0]["bounty"]["brand_name"])
    console.log(450, addProcess[0]["bounty"]["brand_id"])

    this.bountyTemplate.push(addProcess[0]);
    this.hideBounty()
  }
}


