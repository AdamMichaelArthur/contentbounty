import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList, Renderer2, ViewContainerRef } from '@angular/core';
import { SidebarService } from '../../_components/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { SharedService } from '../../_services/shared.service'
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { fakeAsync } from '@angular/core/testing';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailSendService } from '../email-send/email-send.service';


@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent extends BaseComponent implements OnInit {
  public badges: string[] = ["badge badge-primary", "badge badge-secondary", "badge badge-success", "badge badge-danger", "badge badge-warning", "badge badge-info", "badge badge-light", "badge badge-dark"];
  public errorText: string;
  ifErrorMessage = false
  date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  message: string = "";

 @ViewChild("popup") popup:ElementRef<any>;
 @ViewChild("blur") blur:ElementRef<any>;
 @ViewChild("editor2") editor:EditorComponent;


  constructor(public service: BaseService, public elementRef: ElementRef,
    public sharedService: SharedService, private rend: Renderer2, private router: Router,private http:HttpClient,private emailService:EmailSendService) {
    super(service, elementRef)
    this.errorText = ''
  }
  showNotification = true;
  email_error = false;
  outreach_emails_filter = "";
  filterStr = "";
  brand = {}
  bounty = {}
  brand_id = ""
  bounty_id = ""
  loadFlextable: boolean = true;
  mergeFields: Array<any> = [] = [];
  // start_campaing :any
  public notifyHeader: string = "";
  dataModel: string = '';
  ngOnInit(): void {
    this.linkGmail();
    //console.log(this.date)
    setInterval(() => {
      this.filetype = false
    }, 5000);

    this.bounty_id = this.sharedService["_id"];
    console.log("olololol" + this.sharedService["_variableData"])
    console.log("llll", this.sharedService._variableData)



    this.service.brandDataFromBountyId(this.bounty_id).subscribe(data => {
      this.brand = data["brand"];
      console.log("brand...", data["brand"]._id);
      this.bounty = data["bounty"];
      this.bounty_id = data["bounty"]._id
      this.brand_id = data["brand"]._id
      console.log("hello", this.brand_id, this.bounty_id)
      this.filterStr = `{ "brand_id": "${this.brand_id}", "bounty_id":"${this.bounty_id}", "campaigns": { "$exists":false} }`
      console.log(39, this.filterStr);
      this.loadFlextable = true;
      this.getEmail(data["brand"]._id)
    }, err => {
      this.loadFlextable = false;

    });

    this.service.getSelectedMergeFields("outreach_emails").subscribe(data => {
      this.mergeFields = data["outreach_emails"];
    }, err => {

    });
  }

 

  getEmail(brand_id) {
    this.service.email_address(brand_id).subscribe(data => {
      var value = data["gmails"];
      console.log("emails data", value);
      if (data["gmails"].length) {
        data["gmails"].forEach(element =>
          this.select_val.push(element)
          ////console.log(element)
        );
        this.f_address = data["gmails"][0].email;
        console.log("1st email", data["gmails"][0].email)
      }
      if (!data["gmails"].length) {
        this.email_error = true;
      }

      // else{
      //   alert("Error")
      //   return;
      // }

      //this.select_val.push(value.email);
      //this.campaign_name = data["gmails"][0].first +" " + data["gmails"][0].last
      // }
      //console.log(this.select_val , "Salma")
      // //console.log(56,"gmails", data["gmails"]);
    });
  }




  //**********Start********** *//
  // For select dropdown
  isDropdown: boolean = false;
  select_val = []
  f_address: any = ""
  f_name = ""
  selectOptions() {
    this.isDropdown = !this.isDropdown
  }
  selectVal(data: any) {
    this.f_address = data.email;
    this.f_name = data.first + data.last
    //console.log(data)
    this.isDropdown = false
  }

  gmail_url: any = ''
  linkGmail() {
    // var userEmail = sessionStorage.getItem('email');
    // this.service.linkGmail(userEmail).subscribe((data: any) => {
    //   if (data.Error === 505) {
    //     //console.log("Nai")
    //   } else {
    //     this.gmail_url = data.integrations.authURL;
    //   }
    // },
    //   (error) => {
    //     //console.log(JSON.stringify(error));
    //   }
    // )
  }
  // For select dropdown end
  //**********Start end********** *//

  //**********Recipient********** *//
  // For attach change
  attachData: any = [];
  attachEmail: any = [];
  fileName: any;
  if_attach: boolean = false;
  filetype: boolean = false;
  ifAttach(files: FileList) {
    // this.if_attach = true
    // //console.log(this.attachData)
    // //console.log(event.target.files[0].name)
    ////console.log(files);
    let file: File = files.item(0);
    //console.log(file.name);
    //console.log(file.size);
    //console.log(file.type);
    if (file.type != 'application/vnd.ms-excel') {
      this.filetype = true;
    } else {
      if (files && files.length > 0) {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          let csv: string = reader.result as string;
          //console.log(csv);
          //this.fileName = csv.split(",")
          const obj = {
            date: csv.split(","),
            name: file.name
          }
          this.attachData.push(obj)
          //console.log(this.attachData)

          let aaa: any = reader.result;
          //console.log(aaa)
        }
      }
      this.if_attach = true
    }
  }
  deleteAttach(data) {
    const index: number = this.attachData.indexOf(data);
    if (index !== -1) {
      this.attachData.splice(index, 1)
    }
    if (this.attachData.length <= 0) {
      this.if_attach = false
    }
  }
  // For attach change end
  // For choose name
  emailMenually: string
  choose_name: boolean = false;
  chooseName() {
    this.choose_name = true;
  }
  chooseNameHide() {
    this.attachEmail.push(this.emailMenually)
    this.choose_name = false;
    const obj = {
      date: this.attachEmail,
      name: this.dateName
    }
    this.attachData.push(obj)
    this.if_attach = true
  }
  // For choose name end
  // For show import
  dateName = formatDate(new Date(), 'yyyy/MM/dd', 'en');
  isShowImport: boolean = false;
  showImport() {
    this.isShowImport = true
  }
  // For show import end
  //**********end Recipient********** *//

  //**********Compose********** *//  
  // For segment popup
  test_segment: boolean = false;
  testSegment() {
    this.test_segment = true
  }
  testSegmentHide() {
    this.test_segment = false
  }
  // For segment popup end

  // For Compose options
  bold: boolean = false;
  italic: boolean = false;
  alignLeft: boolean = false;
  alignRight: boolean = false;
  alignCenter: boolean = false;
  alignJustify: boolean = false;

  fileData: File = null;
  previewUrl: any = null;
  fileChangeEvent(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }
  // For Compose options end

  // For save as template
  template: any = {
    subject: '',
    title: '',
    body: '',
    bounty_id: '',
    brand_id: ''
  }

  new_templates: any = [];
  template_subject = ''
  template_body = ''
  template_name = ''
  templatesOptions: any = ["email", "first", "last", "name", "unsubscribeURL"];
  save_as: boolean = false;
  showWarning = false;
  templateSavePopup() {
    this.ifErrorMessageSend=false;
    if (!this.template.subject || !this.template.body) {
      //this.showWarning=true;
      this.ifErrorMessage = true;
      this.errorText = !this.template.subject ? "Template subject is required" : 'Template body is required';
      return
    }
    this.save_as = !this.save_as

  }
  hidepopupWarining() {
    this.showWarning = false;
  }
  hideWarning() {
    this.showWarning = false;
  }
  errorForSave = false
  templateSaveFunc() {
    this.errorForSave = false
    if (!this.template_name) {
      this.errorForSave = true
      return
    }
    this.loading = true
    //this.new_templates.push(this.template)
    // this.template = {
    //   subject: '',
    //   title: '',
    //   body: ''
    // }
    //console.log(this.new_templates)
    //this.save_as = !this.save_as
    let body = {
      "template_name": this.template_name,
      "subject": this.template.subject,
      "body": this.template.body,
      "campaign_id": this.bounty_id,
      "brand_id": this.brand_id,
    }

    this.service.save_template(body).subscribe(
      (data: any) => {
        console.log(data.templates);
        this.save_as = !this.save_as
        this.template_name = ''
        this.loading = false
        //this.templateChoosePopup()
      }, err => {
        this.ifErrorMessage = true;
        this.message = "Failed to save template";
      })
  }
  templateSaveFuncCancle() {
    this.errorForSave = false;
    this.save_as = !this.save_as
  }
  // For save as template end

  // For shoose template
  choose_template: boolean = false;
  pages: any = {}
  totalRecords: number = 0;
  currentPage: number = 0;
  previousPage: number = 0;
  numOfPages: number = 0;
  nextPage: number = 0;
  fakeArray: number[];
  loader = false
  noTemplateData = false;
  templateChoosePopup() {
    this.ifErrorMessageSend=false
    console.log("opopopopop---------")
    this.loader = true
    this.noTemplateData = false;
    this.service.choose_template().subscribe(
      (data: any) => {
        if (!data.templates) {
          this.noTemplateData = true;
          this.loader = false;
          return;
        }
        console.log("templates:", data.templates);
        this.new_templates = data.templates
        this.pages = data.pagination
        this.numOfPages = this.pages.number_of_pages;
        this.totalRecords = this.pages.total_records;
        this.previousPage = this.pages.previous_page;
        this.nextPage = this.pages.next_page;
        this.currentPage = this.pages.current_page
        this.fakeArray = new Array(this.numOfPages);
        //console.log(this.pages)
        this.choose_template = !this.choose_template
        this.loader = false

      }, err => {
        this.loader = false;
        this.ifErrorMessage = true;
        this.message = "Error while choosing template!"

      })

  }
  nextItem = 0;
  nextActive = "";
  loading = false;
  pagination_template(num: number) {
    this.loading = true;
    this.nextActive = 'active'
    this.service.choose_template_pagination(this.pages.pages[num].page_endpoint).subscribe(
      (data: any) => {
        console.log("templates:", data.templates);
        this.new_templates = data.templates
        this.pages = data.pagination
        this.loading = false;
      })
    this.nextItem = num;
  }

  templateChooseCancle() {
    this.unlockEmail=false;
    this.maxClicked=false
    this.choose_template = !this.choose_template;
  }

  public currentSelected;
  previewTemplateFunc(data, i) {
    //console.log("datadatadatadatadata",data.id)
    //console.log(data)
    this.template = {
      subject: data.subject,
      title: data.title,
      body: data.body,
    }
    //new_templates
    let x = this.new_templates.find(x => x._id === data._id)
    console.log('datatatatatt', x);
    this.currentSelected = x._id;
  }
  // For shoose template

  // For add task
  //ifAddTask:boolean = false;
  task: number = 0;
  tasklist: any = []

  taskData: any = {
    delay: "",
    selectedOp: "",
    taskInput: ""
  };
  tasklistData: any = []
  addTask() {
    this.taskData = {
      delay: "",
      selectedOp: "",
      taskInput: ""
    };
    //this.ifAddTask = true;
    this.tasklist.push(this.task);
  }
  saveTask(i) {
    this.taskData = {
      delay: this.delay[i],
      selectedOp: this.selectedOp[i],
      taskInput: this.taskInput[i]
    };
    this.tasklistData.push(this.taskData);
    //console.log(this.tasklistData)
    // //console.log(this.delay.toString())
  }

  deletTask(data) {
    const index: number = this.tasklist.indexOf(data);
    if (index !== -1) {
      this.tasklist.splice(index, 1)
    }
  }

  add_delay: boolean[] = [];
  delay: any[] = [];
  addDelay(i) {
    this.add_delay[i] = !this.add_delay[i];
    this.delay[i]
  }
  // task_select_val: boolean[] = []
  // taskSelectOp(i){
  //   this.task_select_val[i] = !this.task_select_val[i]
  // }
  t_s_val: any = [
    {
      title: 'Phone Call',
      icon: 'fa-phone'
    },
    {
      title: 'Email',
      icon: 'fa-envelope'
    }
  ]
  // task_select:string = "Phone Call";
  // task_select_i:string = "fa-phone";
  selectedOp: any[] = [];
  taskInput: any[] = []
  taskInputVal: any[] = ["Make a phone call", "Make an email"]
  taskSelectVal(data, i) {
    if (data === "fa-phone") {
      this.taskInput[i] = this.taskInputVal[0];
      // this.selectedOp[i] = this.taskInputVal[0];
    }
    if (data === "fa-envelope") {
      this.taskInput[i] = this.taskInputVal[1];
      // this.selectedOp[i] = this.taskInputVal[1];
    }
  }
  // For add task end





  // For add flow up
  replaiChain: any = ["--New Email--", "Re"];
  followUpData: any = {
    replai_chain: "",
    followup_sub: "",
    followup_body: "",
    followup_template_title: "",
    followup_delay: ""
  }

  replai_chain: any[] = [];
  followup_sub: any[] = [];
  followup_body: any[] = [];
  followup_template_title: any[] = [];



  followup: number = 0;
  followuplist: any = [];
  ifFollowup: boolean = false;
  addFollowUp() {
    this.followuplist.push(this.followup += 1)
    if (this.ifFollowup === false) {
      this.ifFollowup = true;
    }
  }



  followUpDataList: any[] = []
  followUpSave(i) {
    this.followUpData = {
      replai_chain: this.replai_chain[i],
      followup_sub: this.followup_sub[i],
      followup_body: this.followup_body[i],
      followup_template_title: this.followup_template_title[i],
      followup_delay: this.followup_delay[i]
    }
    this.followUpDataList.push(this.followUpData);
    //console.log(this.followUpDataList)
  }

  save_add_followup: boolean[] = []
  templateFollowUpSavePopup(i) {
    this.save_add_followup[i] = !this.save_add_followup[i];
  }
  templateFollowUpSaveFuncCancle(i) {
    this.save_add_followup[i] = !this.save_add_followup[i];
  }

  followUpTemplateList: any = []
  templateFollowUpSaveFunc(i) {
    this.followUpData = {
      replai_chain: this.replai_chain[i],
      followup_sub: this.followup_sub[i],
      followup_body: this.followup_body[i],
      followup_template_title: this.followup_template_title[i],
      followup_delay: this.followup_delay[i]
    }
    this.followUpTemplateList.push(this.followUpData)
    //console.log(this.followUpTemplateList);
    this.save_add_followup[i] = !this.save_add_followup[i];
  }


  deletFollowup(data) {
    const index: number = this.followuplist.indexOf(data);
    if (index !== -1) {
      this.followuplist.splice(index, 1)
    }
    if (this.followuplist.length <= 0) {
      this.ifFollowup = false;
    }
  }
  add_followup: boolean[] = [];
  followup_delay: any[] = [];
  addFollowupDelay(i) {
    this.add_followup[i] = !this.add_followup[i];
    this.followup_delay[i]
  }
  // For add flow up end
  // Choose follow up template
  choose_followup_template: boolean[] = []
  templateFollowUpChoosePopup(i) {
    this.choose_followup_template[i] = !this.choose_followup_template[i];
  }
  templateFollowUpChooseCancle(i) {
    this.choose_followup_template[i] = !this.choose_followup_template[i];
  }

  temp_followup_title: any;
  temp_followup_body: any;
  previewFollowUpTemplateFunc(data, i) {
    this.temp_followup_title = data.followup_template_title;
    this.temp_followup_body = data.followup_body;
    //console.log(data)
  }
  templateFollowUpSave(i) {
    this.followup_body[i] = this.temp_followup_body,
      this.choose_followup_template[i] = !this.choose_followup_template[i];
  }
  // Choose follow up template end





  // For add drips
  dripsData: any = {
    drips_sub: "",
    drips_body: "",
    drips_template_title: "",
    drips_in: ""
  }
  drips_sub: any[] = [];
  drips_body: any[] = [];
  drips_template_title: any[] = [];

  save_add_drips: boolean[] = []
  templateDripsSavePopup(i) {
    this.save_add_drips[i] = !this.save_add_drips[i];
  }
  templateDripsSavePopupCancle(i) {
    this.save_add_drips[i] = !this.save_add_drips[i];
  }

  dripsTemplateList: any = []
  templateDripsSave(i) {
    this.dripsData = {
      drips_sub: this.drips_sub[i],
      drips_body: this.drips_body[i],
      drips_template_title: this.drips_template_title[i],
      drips_in: this.drips_in[i]
    }
    this.dripsTemplateList.push(this.dripsData)
    //console.log(this.dripsTemplateList);
    this.save_add_drips[i] = !this.save_add_drips[i];
  }

  dripsDataList: any[] = []
  dripsUpSave(i) {
    this.dripsData = {
      drips_sub: this.drips_sub[i],
      drips_body: this.drips_body[i],
      drips_template_title: this.drips_template_title[i],
      drips_in: this.drips_in[i]
    }
    this.dripsDataList.push(this.dripsData);
    //console.log(this.dripsDataList)
  }

  // Choose drips template
  choose_drips_template: boolean[] = []
  templateDripsChoosePopup(i) {
    this.choose_drips_template[i] = !this.choose_drips_template[i];
  }
  templateDripsChooseCancle(i) {
    this.choose_drips_template[i] = !this.choose_drips_template[i];
  }

  temp_drips_title: any;
  temp_drips_body: any;
  previewDripsTemplateFunc(data, i) {
    this.temp_drips_title = data.drips_template_title;
    this.temp_drips_body = data.drips_body;
    //console.log(data)
  }
  previewDripsTemplateFuncSave(i) {
    this.drips_body[i] = this.temp_drips_body,
      this.choose_drips_template[i] = !this.choose_drips_template[i];
  }
  // Choose drips template end

  drips: number = 0;
  dripslist: any = [];
  ifDrips: boolean = false;
  addDrips() {
    //this.ifAddTask = true;
    this.dripslist.push(this.drips)
    if (this.ifDrips === false) {
      this.ifDrips = true;
    }
  }
  deletDrips(data) {
    const index: number = this.dripslist.indexOf(data);
    if (index !== -1) {
      this.dripslist.splice(index, 1)
    }
    if (this.dripslist.length <= 0) {
      this.ifDrips = false;
    }
  }
  add_drips: boolean[] = [];
  drips_in: any[] = [];
  addDripsDelay(i) {
    this.add_drips[i] = !this.add_drips[i];
    this.drips_in[i]
  }
  // For add drips end






  // For add on clicl
  onClickData: any = {
    onclick_sub: "",
    onclick_url: "",
    onclick_body: "",
    onclick_template_title: "",
    onclicl_in: ""
  }
  onclick_sub: any[] = [];
  onclick_url: any[] = [];
  onclick_body: any[] = [];
  onclick_template_title: any[] = [];

  save_add_onclick: boolean[] = []
  templateOnClickSavePopup(i) {
    this.save_add_onclick[i] = !this.save_add_onclick[i];
  }
  templateOnClickSavePopupCancle(i) {
    this.save_add_onclick[i] = !this.save_add_onclick[i];
  }

  onclickTemplateList: any = []
  templateOnclickSave(i) {
    this.onClickData = {
      onclick_sub: this.onclick_sub[i],
      onclick_url: this.onclick_url[i],
      onclick_body: this.onclick_body[i],
      onclick_template_title: this.onclick_template_title[i],
      onclicl_in: this.onclicl_in[i]
    }
    this.onclickTemplateList.push(this.onClickData)
    //console.log(this.onclickTemplateList);
    this.save_add_onclick[i] = !this.save_add_onclick[i];
  }

  onclickDataList: any[] = []
  onclickUpSave(i) {
    this.onClickData = {
      onclick_sub: this.onclick_sub[i],
      onclick_url: this.onclick_url[i],
      onclick_body: this.onclick_body[i],
      onclick_template_title: this.onclick_template_title[i],
      onclicl_in: this.onclicl_in[i]
    }
    this.onclickDataList.push(this.onClickData);
    //console.log(this.onclickDataList)
  }

  // Choose Onclick template
  choose_onclick_template: boolean[] = []
  templateOnclickChoosePopup(i) {
    this.choose_onclick_template[i] = !this.choose_onclick_template[i];
  }
  templateOnclickChooseCancle(i) {
    this.choose_onclick_template[i] = !this.choose_onclick_template[i];
  }

  temp_onclick_title: any;
  temp_onclick_body: any;
  temp_onclick_url: any;
  previewOnclickTemplateFunc(data, i) {
    this.temp_onclick_title = data.onclick_template_title;
    this.temp_onclick_body = data.onclick_body;
    this.temp_onclick_url = data.onclick_url;
    //console.log(data)
  }
  previewOnclickTemplateFuncSave(i) {
    this.onclick_body[i] = this.temp_onclick_body,
      this.choose_onclick_template[i] = !this.choose_onclick_template[i];
  }
  // Choose Onclick template end

  onclicl: number = 0;
  onclicllist: any = [];
  ifOnclicl: boolean = false;
  addOnclicl() {
    //this.ifAddTask = true;
    this.onclicllist.push(this.onclicl)
    if (this.ifOnclicl === false) {
      this.ifOnclicl = true;
    }
  }
  deletOnclicl(data) {
    const index: number = this.onclicllist.indexOf(data);
    if (index !== -1) {
      this.onclicllist.splice(index, 1)
    }
    if (this.onclicllist.length <= 0) {
      this.ifOnclicl = false;
    }
  }

  add_onclicl: boolean[] = [];
  onclicl_in: any[] = [];
  addOncliclDelay(i) {
    this.add_onclicl[i] = !this.add_onclicl[i];
    this.onclicl_in[i]
  }
  // For add on clicl end
  //**********Compose end********** *//

  //**********Preview********** *//
  searchText = "";
  searchUI: boolean = false;
  showSearch() {
    this.searchUI = true;
  }
  clickOutside() {
    this.searchUI = false;
  }

  previewDataLists: any[] = [
    {
      label: "You sound like a human",
      condisitions: false,
    },
    {
      label: "Your signature looks good",
      condisitions: false,
    },
    {
      label: "You sound call-to-action clear",
      condisitions: false,
    },
    {
      label: "You've sent a test email and checked it on your phone",
      condisitions: false,
    }
  ]


  total_recipient: number = 0;
  decress_recipient: number = 1;

  recipientsMail: Array<string> = [];
  activeRecipient: string;
  lastId = 0;
  recepit_email: ''
  preview_true = false;
  preview_subject = ''
  preview_body = ""
  nextRecipient() {

    // if(this.decress_recipient <= this.total_recipient-1){
    //   this.decress_recipient = ++this.decress_recipient;

    //   const currentIndex = this.recipientsMail.indexOf(this.activeRecipient);
    //   const newIndex = currentIndex === this.recipientsMail.length - 1 ? 0 : currentIndex + 1;
    //   this.activeRecipient = this.recipientsMail[newIndex];
    // }

    this.service.getNextSelectedItem("outreach_emails", this.lastId).subscribe(
      (data: any) => {

        console.log(785, this.mergeFields);

        var tmpTemplate = { ... this.template }
        for (var i = 0; i < this.mergeFields.length; i++) {

          if (tmpTemplate.body.indexOf(this.mergeFields[i]) != -1) {
            tmpTemplate.body = tmpTemplate.body.replace(this.mergeFields[i], data.outreach_emails[this.mergeFields[i]])
          }

        }


        //var demoData = { ... this.template };

        //this.template = tmpTemplate
        console.log(798, tmpTemplate, this.template)
        this.preview_true = true;
        this.lastId = data["outreach_emails"]["_id"];
        // this.recipientsMail.push({ "address": data["outreach_emails"]["email"] } )
        //this.activeRecipient.address = data["outreach_emails"]["email"];
        //console.log(679, data["outreach_emails"]["Email"]);
        this.recepit_email = data["outreach_emails"]["Email"]
        this.demoData = {
          title: this.date,
          address: this.f_address,
          recipient: this.attachData,
          template: tmpTemplate,
          tasklistData: this.tasklistData,
          followUpDataList: this.followUpDataList,
          dripsDataList: this.dripsDataList,
          onclickDataList: this.onclickDataList,
          first_name: data["outreach_emails"]["First"],
          email: data["outreach_emails"]["Email"]
        }
        //,
        //this.preview_subject = this.demoData.template.subject 
        // + " "+ data["outreach_emails"]["First"]
        //this.preview_body = this.demoData.template.body
        // + "<br/>"+ data["outreach_emails"]["Email"]
      }, err => {
        this.ifErrorMessage = true;
        this.message = "Failed to select next recipient"
      })
  }
  outreach_email = '';
  first_name = '';
  last_name = '';

  previousRecipient() {
    // if(this.decress_recipient >= 1){
    //   this.decress_recipient = --this.decress_recipient;

    //   const currentIndex = this.recipientsMail.indexOf(this.activeRecipient);
    //   const newIndex = currentIndex === 0 ? this.recipientsMail.length - 1 : currentIndex - 1;
    //   this.activeRecipient = this.recipientsMail[newIndex];
    // }
    this.service.getPrevSelectedItem("outreach_emails", this.lastId).subscribe(
      (data: any) => {

        this.lastId = data["outreach_emails"]["Email"];
        this.first_name = data["outreach_emails"]["First"];
        this.last_name = data["outreach_emails"]["Last"];
        this.outreach_email = data["outreach_emails"]["_id"];
        // this.recipientsMail.push({ "address": data["outreach_emails"]["email"] } )
        //this.activeRecipient.address = data["outreach_emails"]["email"];
        //console.log(679, data["outreach_emails"]["Email"]);
        this.preview_true = true;
        this.demoData = {
          title: this.date,
          address: this.f_address,
          recipient: this.attachData,
          template: this.template,
          tasklistData: this.tasklistData,
          followUpDataList: this.followUpDataList,
          dripsDataList: this.dripsDataList,
          onclickDataList: this.onclickDataList,
          first_name: data["outreach_emails"]["First"],
          email: data["outreach_emails"]["Email"]
        }
        //this.preview_subject = this.demoData.template.subject + data["outreach_emails"]["First"]
        //this.preview_body = this.demoData.template.body + data["outreach_emails"]["Email"]
      }, err => {
        this.ifErrorMessage = true;
        this.message = "Failed to select previous recipient"
      })
  }
  //**********Preview end********** *//



  //**********Options********** *//
  optionsDataLists: any = {
    optionsCondLists: [
      {
        label: "Track opens",
        condisitions: false,
      },
      {
        label: "Track line clicks",
        condisitions: true,
      },
      {
        label: "Schedule this send",
        condisitions: false,
      }
    ],
    optionsInfo: [],
    optionsAggrement: {
      label: "I'll obey pertinent laws and I've read these",
      condisitions: false,
    }
  }
  // OPtion tab UI
  isCalups: boolean = false;
  calupsClick() {
    this.isCalups = !this.isCalups
  }

  selectLesd: boolean = false;
  leads = ["Me", "Adam", "Salma"]
  leads_selected: string = "Me"
  selectLeads() {
    this.selectLesd = !this.selectLesd
  }
  selectLeadVal(data: any) {
    this.leads_selected = data;
    this.selectLesd = false
  }

  recipients = ["Replies", "Opens"]
  recipients_selected: any[] = [];
  recipients_time: any[] = [];
  recipient: number = 1;
  recipientlist: any = []
  addRecipient() {
    //this.ifAddTask = true;
    this.recipientlist.push(this.recipient += 1);
    this.recipients_selected[this.recipient]
    this.recipients_time[this.recipient]
  }
  addRecipientData(i: number) {
    let data = {
      recipients_selected: this.recipients_selected[i],
      recipients_time: this.recipients_time[i],
    };
    this.optionsDataLists.optionsInfo.push(data);
    //console.log(this.optionsDataLists)
  }
  deletRecipient(data) {
    const index: number = this.recipientlist.indexOf(data);
    if (index !== -1) {
      this.recipientlist.splice(index, 1)
    }
  }
  // OPtion tab UI end
  //**********Options end********** *//
  //**********Send********** *//
  start_campaign: boolean = false;
  startCampaign() {
    this.start_campaign = true
    let body = this.campaigns
    this.service.startin_percampaign(this.campaigns).subscribe(data => {
      console.log(880, data)
      //this.start_campaign = false
    }, err => {
      this.ifErrorMessage = true;
      this.message = "Failed to start campaign"
    });
  }
  startCampaignClose() {
    this.start_campaign = false;
  }
  bountyStep: any;
  startCampaignCancle() {
    this.start_campaign = !this.start_campaign;
    this.bountyStep = this.sharedService._variableData
    var body = this.bountyStep
    body["id"] = this.bounty["_id"];
    this.service.completeBountyFromSpecialtyComponent(body).subscribe(data => {
      console.log(53, data);
      //this.location.back()
    }, err => {
      this.ifErrorMessage = true;
      this.message = "Cant cancel campaign";
    });
    this.router.navigate(["/in_progress"]);
  }

  //**********Send end********** *//

  campaign_name = 'New Campaign for ' + new Date().toDateString();
  demoData: any = {
    title: '',
    address: '',
    recipient: '',
    template: ''
  }
  // For tab setting
  preview_data: any = {
    title: '',
    address: '',
    recipient: '',
    template: ''
  }
  viewMode = 'start';
  campaigns = {}
  f_address_name_error = ''
  f_address_error = ''
  f_address_init = false
  f_address_name = false
  isDisabled = false
  viewMode2(data) {
    this.ifErrorMessageSend=false
    this.errorText = ""
    this.ifErrorMessage = false;
    this.viewMode = data
    //console.log(data)
    //console.log("Brand and bounty",this.filterStr)
    if (this.viewMode === 'recipient') {
      if (this.f_address && this.campaign_name) {
        this.demoData = {
          date: this.date,
          address: this.f_address,
          campaign_name: this.campaign_name,
          name: this.f_name
        }
        this.ifErrorMessage = false;
        //console.log(this.demoData)
      } else {
        if (this.f_address == '') {
          this.ifErrorMessage = true;
          this.errorText = "Email is required";
          this.viewMode = 'start';
          return
        } else {
          if (this.campaign_name == '') {
            this.ifErrorMessage = true;
            this.errorText = "Campaign name is required";
            this.viewMode = 'start';
            return
          } else {
            if (this.campaign_name != '' || this.f_address != '') {
              this.ifErrorMessage = false;
            }
          }
        }
      }
    }
    if (this.viewMode === 'compose') {


      this.ifErrorMessage = false;
      if (!this.f_address || !this.campaign_name) {
        if (!this.f_address) {
          this.ifErrorMessage = true;
          this.errorText = "Email is required";

        }
        if (!this.campaign_name) {
          this.ifErrorMessage = true;
          this.errorText = "Campaign name is required";
          
        }
        this.viewMode = "start";
        return
      }
      else {
        this.demoData = {
          date: this.date,
          address: this.f_address,
          campaign_name: this.campaign_name,
          recipient: this.attachData,
          name: this.f_name
        }
        //console.log(this.demoData)
        if (this.demoData?.recipient?.length > 0) {
          this.total_recipient = this.demoData?.recipient[0]?.date.length;
          this.recipientsMail = this.demoData?.recipient[0]?.date;
          console.log("demodata", this.demoData)
          this.activeRecipient = this.recipientsMail[0];
        }
      }
    }
    if (this.viewMode === 'review') {
      this.ifErrorMessage = false;
      if (!this.f_address || !this.campaign_name) {
        if (!this.f_address) {
          this.ifErrorMessage = true;
          this.errorText = "Email is required";
        }
        if (!this.campaign_name) {
          this.ifErrorMessage = true;
          this.errorText = "Campaign name is required";
        }
        this.viewMode = "start";
        return;
      }
      if (this.template.subject && this.template.body) {
        this.demoData = {
          date: this.date,
          campaign_name: this.campaign_name,
          name: this.f_name,
          address: this.f_address,
          recipient: this.attachData,
          template: this.template,
          tasklistData: this.tasklistData,
          followUpDataList: this.followUpDataList,
          dripsDataList: this.dripsDataList,
          onclickDataList: this.onclickDataList,
          first_name: this.first_name,
          email: this.outreach_email
        }
        this.isDisabled = true
        this.preview_data = {
          title: this.demoData.template.subject + "EMAIL"
        }

      } else {
        if (this.template.subject == '') {
          this.ifErrorMessage = true;
          this.errorText = "Initial Subject is required";
          this.viewMode = 'compose';
          return
        } else {
          if (this.template.body == '') {
            this.ifErrorMessage = true;
            this.errorText = "Initial Body is required";
            this.viewMode = 'compose';
            return
          } else {
            if (this.template.body != '' || this.template.body != null || this.template.body != undefined) {
              this.ifErrorMessage = false;
            }
          }
        }
      }
    }


    // if (this.viewMode === 'option') {
    //   this.demoData = {
    //     date: this.date,
    //     campaign_name:this.campaign_name,
    //     address: this.f_address,
    //     recipient: this.attachData,
    //     template: this.template,
    //     tasklistData: this.tasklistData,
    //     followUpDataList: this.followUpDataList,
    //     dripsDataList: this.dripsDataList,
    //     onclickDataList: this.onclickDataList,
    //     previewDataLists: this.previewDataLists,
    //   }
    //   //console.log(this.demoData)
    //   ////console.log('option')
    // }


    if (this.viewMode === 'send') {
      this.ifErrorMessage = false;
      if (!this.f_address || !this.campaign_name) {
        this.ifErrorMessage = true;
        this.errorText = "Email is required";
        this.viewMode = "start";
        return
      }
      //
      if (this.template?.subject == '') {
        this.ifErrorMessage = true;
        this.errorText = "Initial Subject is required";
        this.viewMode = 'compose';
        return
      } else {
        if (this.template?.body == '') {
          this.ifErrorMessage = true;
          this.errorText = "Initial Body is required";
          this.viewMode = 'compose';
          return
        }
      }
      if (this.demoData?.template?.subject && this.demoData?.template?.body) {
        //console.log("demo", this.demoData);
        this.demoData = {
          date: this.date,
          campaign_name: this.campaign_name,
          name: this.f_name,
          address: this.f_address,
          recipient: this.attachData,
          template: this.template,
          tasklistData: this.tasklistData,
          followUpDataList: this.followUpDataList,
          dripsDataList: this.dripsDataList,
          onclickDataList: this.onclickDataList,
          previewDataLists: this.previewDataLists,
          optionsDataLists: this.optionsDataLists

        }
        //console.log(this.demoData)
        // //console.log('send')
        let campaigns = {
          "brand_id": this.brand_id,
          "bounty_id": this.bounty_id,
          "subject": this.demoData?.template?.subject + " " + this.first_name,
          "body": this.demoData?.template.body,
          "campaing_name": this.campaign_name,
          "sending_name": this.f_name,
          "sending_email": this.demoData?.address,
        }
        this.campaigns = campaigns
        //console.log(campaigns)

      }
      else {
        if (this.demoData?.template?.subject == '') {
          this.ifErrorMessage = true;
          this.errorText = "Initial Subject is required";
          this.viewMode = 'review';
          return
        } else {
          if (this.demoData?.template?.body == '') {
            this.ifErrorMessage = true;
            this.errorText = "Initial Body is required";
            this.viewMode = 'review';
            return
          } else {
            if (this.demoData?.template?.subject != '' || this.demoData.template.body != '') {
              this.ifErrorMessage = false;
            }
          }
        }
      }
    }
  }
  // For tab setting


  flextableHeaderButtonClicked($event) {
    //console.log("Helllo header button ", $event)
    if ($event === "Select All") {
      this.service.headerButton("keywords", "selectallkeywords", { ...JSON.parse(this.filterStr), "key": "outreach_emails" }).subscribe(
        (data: any) => {
          //console.log(43, data);
          this.refreshFlextable()
        }
      )

      return;
    }

    if ($event === "Unselect All") {
      let body = {
        bounty_id: this.bounty_id,
        brand_id: this.brand_id
      }
    }

  }
  badgesEvent(event: any) {
    let Color = ['lightgreen', 'red', 'blue', 'yellow', 'lightblue', 'green', 'grey', '#D2691E', "#B8860B",
      "#228B22",
      "#ADFF2F",
      "#7CFC00",
      "#4B0082",
      "#800000",
      "#191970",
      "#808000",
      "#4169E1",
      "#A0522D",
      "#00FF7F"];
    let randomColor = Color[Math.floor(Math.random() * Color.length)]
    if (!this.template.body) { this.template.body = "<p>" + `<span style = "background-color:${randomColor};padding:2px">` + event + '</span>'+'&nbsp;'+ "</p>"; 
    }
    else {
      const re = new RegExp('</p>' + "$");
      this.template.body = this.template.body.replace(re, '');
      console.log(this.template.body)
     this.template.body = this.template.body.replace('<p>', '');
      //this.template.body = this.template.body.replaceAll('&nbsp;', '');
      console.log(this.template.body)
      //this.template.body = this.template.body.replace('&nbsp;</p><span>', '</p></span>');
      this.template.body.trim();
      this.template.body ='<p>'+ this.template.body + ' ' + '' + `<span style = "background-color:${randomColor};padding:2px">` + event + '</span>'+'&nbsp;'+ '</p>'
    }
    console.log(this.template.body)
  }
  notificationColse() {
    this.showNotification = false;
  }

  unlockEmail=false;
  test_email="";
  test_email_clicked=false;
  tinyDisabled=true;
  unlockEmailTemplate(){
    this.editor?.editor?.focus();
    console.log(this.editor)
    if(!this.unlockEmail){
      this.unlockEmail=true;
      return
    }
    if(this.unlockEmail){
      this.unlockEmail=false;
    }
    
    }
  ifErrorMessageSend=false
  showSendEmailPopup=false;
  sendEmailPopup(){
    this.test_email_clicked=false;
    if(!this.template.subject ||!this.template.body){
      this.ifErrorMessageSend=true;
      return
    }
    this.showSendEmailPopup=true;
    
  }
  cancelsendEmailTest(){
    this.test_email_clicked=false
    this.showSendEmailPopup=false
  }
  // public baseUrl = environment.apiBase
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'accept': 'application/json'
  //   }),
  //   withCredentials: true
  // };
  sendEmailTest(){
    // var api_url = this.baseUrl + '/actions/datasource/outreach_emails/action/sendsniperemail';
    this.test_email_clicked=true;
    if(!this.test_email){
      return
    }
    // let emailObj={
    //   sender:'adamarthursandiego@gmail.com',
    //   recipient:'gugly2009@gmail.com',
    //   body:this.template.body,
    //   subject:this.template.subject
    // }
    let emailObj = {
      
        "brand_id":'60acb3904d46ea722c26e0a5',
        "to":"apurbahasan1994@gmail.com",
        "campaing_name":"test campaign",
        "from":"gugly.inbrain@gmail.com",
        "subject":"I am testing test emails",
        "body":"this is test email body from camapign compoent "
    
    }
    console.log(emailObj)
    this.emailService.sendSniperEmails(emailObj).subscribe(data=>{
      console.log(data);
    },err=>{console.log(err.messaage)});
    this.showSendEmailPopup=false

  }
  maxClicked=false;
  // it's for maximum screen
  maximizePopup(){
    if(!this.maxClicked){
      this.maxClicked=true;
      return
    }
    if(this.maxClicked){
      this.maxClicked=false
      return
    }
  }
}
