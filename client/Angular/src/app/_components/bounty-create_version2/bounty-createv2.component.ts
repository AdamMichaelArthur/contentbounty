import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { BaseService } from '../base/base.service';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from "@angular/cdk/drag-drop";
import { SiteAdminService } from '../siteadmin-home/siteadmin-home-service';
import { SharedService } from 'src/app/_services/shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
//import { ValueTransformer } from '@angular/compiler/src/util';


@Component({
  selector: 'app-bounty-createv2',
  templateUrl: './bounty-createv2.component.html',
  styleUrls: ['./bounty-createv2.component.scss']
})
export class BountyCreateComponentv2 implements OnInit {

  constructor(
    public service: BaseService, 
    public siteService: SiteAdminService,
    public sharedService: SharedService,
    public http:HttpClient
  ) { }

  @Input() displayTableButtonArea: boolean = true;
  @Input() content_type;
  @Input() currentBounty: any;
  @Output() hideTableButtonArea = new EventEmitter<boolean>();
  @Output() passBountyTemplate = new EventEmitter<any>();
  @Output('cdkDropDropped')
dropped: EventEmitter<CdkDragDrop<any, any>> =
  new EventEmitter<CdkDragDrop<any, any>>();

  data = []
  sData=[]
  inhouseUsers = []
  sections: any = new Set([]);
  newSec:any=[]
  total_bounty: number = 0;
  currentBrand;
  initialNone=true;
  public baseUrl = environment.apiBase

  columns = "bounty,checkInUser,checkin,content_type,display_pos,created_by,modified_by,editorial_guidelines,files,inhouse,inhouseUser,modified,modifiedAt,owner,selected,skills,stage,step,step_description,suggested_bounty,types"

  ngOnInit(): void {
    this.service.getDistinctArray("skills", "skills", true).subscribe((data: any) => {
     
      this.sData = data;
    })

    this.service.getArrayWithSort("step", {"content_type":this.content_type}, true, 100, { "display_pos":1 }, this.columns).subscribe((data: any) => {   

          this.data = [];
          var sections = []

          this.service.getAllUsersForAccount("users").subscribe(
            (response: any)=>{
              
              for(var i=0; i<response["step"]?.length; i++)
              {

                var obj = {}
                obj["_id"] = response[i]["_id"]
                obj["email"] = response[i]["email"]
                obj["first_name"] = response[i]["first_name"]
                obj["last_name"] = response[i]["last_name"]
                this.inhouseUsers.push(obj)
              }
             
            })

      
          for(var i = 0; i < data["step"].length; i++){
                   
                    var processRow = {}
                    processRow["process"] = false;
                    processRow["inhouse"] = false;
                    processRow["inhouseUser"] = [];
                    processRow["checkin"] = false;
                    processRow["checkInUser"] = [];
                    processRow = Object.assign(processRow, data["step"][i])
                    this.data.push(processRow);
                    sections.push(data["step"][i].stage)
          }
          this.sections = new Set(sections);
          this.newSec=[...this.sections];
          this.data.forEach((value,index)=>{
            value.display_pos=index;
          })
         
      }) 
  }

  disapparePopup(){
    this.displayTableButtonArea = false
    this.hideTableButtonArea.emit(this.displayTableButtonArea);
    // this.unusedKeywords = !this.unusedKeywords
  }

  stepChecked(process_step){
    process_step["previous_values"] = [];
    process_step["previous_values"].push(process_step.bounty)
    if(process_step.process){
      process_step.bounty = process_step.suggested_bounty;
      this.total_bounty += process_step.bounty;
    }
    else {
      this.total_bounty = process_step.bounty;
      //process_step.bounty = 0;
    }
    process_step["previous_values"].push(process_step.bounty)
    
  }

  // initiating inhouse user

  onCheckinHouse(event, i){
    if(event.target.checked){
      this.data[i].inhouseUser = 0
      
    }
  }

  // initiating inhouse user end

  // initiating checkin user

  onCheckcheckIn(event, i){
    if(event.target.checked){
      this.data[i].checkinUser = 0
      
    }
  }

  // initiating checkin user end

  updateBountyTotal($event, process_step){
    
    var newValue = 0;
    if($event?.length == 0 || !$event)
      newValue = 0;
    else
      newValue = parseInt($event);
  
    var lastArPos = process_step["previous_values"].length-1;
    
    this.total_bounty -= process_step["previous_values"][lastArPos]
    process_step["previous_values"].push(newValue)
    //process_step.previous_value = newValue;

    this.total_bounty += newValue;
    // var newValue = parseInt($event.srcElement.value);
    // this.total_bounty -= process_step.bounty;
    // this.total_bounty += newValue;
    process_step.bounty = newValue
  }

  reset(){
    this.total_bounty = 0;

  }

  //Save Guidelines
  additional_instruction:string = "";

  bountyTemplate: Array<any> = [];
  stepAddError=false;
  stepdeleteError=false;
  addGuideClicked=false;
  addGuide(){
    this.reset();
    
    this.addGuideClicked=true;
    this.stepAddError=true;
    this.stepdeleteError=true;
    this.http.post(this.baseUrl + '/actions/datasource/steps/action/resetprocessteps',{"content_type":this.content_type}).subscribe(
      (res:any)=>{
        this.stepdeleteError=false;
        if(res.actions.success===true){
          
          console.log(269, this.data);

          this.http.post(this.baseUrl + '/datasource/step',this.data).subscribe(
            (response)=>{
              
              this.stepAddError=false
            },
            (err=>{
              this.stepAddError=false
  
            })
          );
        }
      },(err=>{
        this.stepdeleteError=false
        this.stepAddError=false
        return

      }),
      ()=>{
        if(!this.data.length){
          this.stepAddError=false
          return
        }
       
      }

    );
    
  }

  // disapparePopup(){
  //   this.displayTableButtonArea = false
  //   this.hideTableButtonArea.emit(this.displayTableButtonArea);
  //   // this.unusedKeywords = !this.unusedKeywords
  // }

  //Save Guidelines

  // Editorial Guidelines
  dropboxLinkInput: any
  dropboxLink: any = [];
  addDropBox(link: string) {
    this.dropboxLink.push(link);
    this.dropboxLinkInput = null
  }
  deleteDropboxLink(link:string){
    const index: number = this.dropboxLink.indexOf(link);
    if (index !== -1) {
      this.dropboxLink.splice(index, 1)
    }
  }
  // Editorial Guidelines

  // Prompt Bucket
  promptLists: any = [];
  volume = 0;
  clicks = 0;
  keywordsAr: Array<any> = [];

  deletePrompt(prompt: string) {
    const index: number = this.promptLists.indexOf(prompt);
    if (index !== -1) {
      for(var i = 0; i < this.keywordsAr.length; i++){

        if(this.keywordsAr[i]["Keyword"] == this.promptLists[index]){
          

          if(this.keywordsAr[i]["Clicks"] != 'undefined'){
            if(Number.isNaN(parseInt(this.keywordsAr[i]["Clicks"])) == false){
              this.clicks -= parseInt(this.keywordsAr[i]["Clicks"]);
            } 
          }

          if(this.keywordsAr[i]["Volume"] != 'undefined'){
            if(Number.isNaN(parseInt(this.keywordsAr[i]["Volume"])) == false){
              this.volume -= parseInt(this.keywordsAr[i]["Volume"])
            } 
          }

        }
      }
      this.promptLists.splice(index, 1)
    }
  }
  onDrop(event: CdkDragDrop<any[]>) {
   
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.data.forEach((value,index)=>{
        value.display_pos=index;
      })
      
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    //always, recalculate the order of the container (the list to drag)
  }
  showStepModal=false;
  addStep(){
    console.log(this.newSec)
    this.showStepModal=true;
    
  }
  disapparePopupStep(){
    this.showStepModal=false;

  }
  // Prompt Bucket end



  ////new 
  stepName='';
  step_description='';
  stage='';
  bounty='';
  files=[];
  error_des = false;
  error_name
  error_stage
  error_bounty
  onBlurMethod(value: any) {
    this.error_des = false;
    if(value=="stepName"){
      if (!this.stepName) {
        this.error_name = true;
      }
      else{
        this.error_name = false;
      }
      return
    }
    if(value=="newSkill"){
      if (!this.newSkill) {
        this.error_skills = true;
      }
      else{
        this.error_skills= false;
      }
      return
    }
    if(value=="stage"){
      if (!this.stage) {
        this.error_stage = true;
      }
      else{
        this.error_stage = false;
      }
      return
    }
    if(value=="bounty"){
      if (!this.bounty) {
        this.error_bounty = true;
      }
      else{
        this.error_bounty= false;
      }
      return
    }
    if(value=="step_description"){
      if (!this.step_description) {
        this.error_des = true;
      }
      else{
        this.error_des = false;
      }
      return
    }
   
    
  }
  onBlurMethodpress(value: any) {
    this.error_des = false;
    if(value=="stepName"){
      if (!this.stepName) {
        this.error_name = true;
      }
      else{
        this.error_name = false;
      }
      return
    }
    if(value=="newSkill"){
      if (!this.newSkill) {
        this.error_skills = true;
      }
      else{
        this.error_skills= false;
      }
      return
    }
    if(value=="stage"){
      if (!this.stage) {
        this.error_stage = true;
      }
      else{
        this.error_stage = false;
      }
      return
    }
    if(value=="bounty"){
      if (this.bounty) {
        this.error_bounty = true;
      }
      else{
        this.error_bounty= false;
      }
      return
    }
    if(value=="step_description"){
      if (!this.step_description) {
        this.error_des = true;
      }
      else{
        this.error_des = false;
      }
      return
    }
    
  }
  saveStep(){    
      if (!this.stepName) {
        this.error_name = true;
        return
      }
      else if (!this.step_description) {
        this.error_des = true;
        return
      }
      else if (!this.stage) {
        this.error_stage = true;
        return
      }
     
      else if (!this.bounty) {
        this.error_bounty = true;
        return
      }
      else{
        this.error_name = false;
      }
      
    let processRow = {}
    
    let data={
    "content_type" :this.content_type,
    "step" : this.stepName,
    "stage" :this.stage,
    "display_pos" : this.data.length,
    "suggested_bounty" : 3.50,
    "bounty" : Number(this.bounty),
    "step_description" : this.step_description,
    "skills":[...this.skills],
    "files":[]
    }
    if(this.files.length>0){
      data.files.push(this.files)
    }


    processRow["process"] = false;
                    processRow["inhouse"] = false;
                    processRow["inhouseUser"] = [];
                    processRow["checkin"] = false;
                    processRow["checkInUser"] = [];
                    processRow = Object.assign(processRow, data)
    if(this.data){
    this.data.push(processRow)
    }
    else{
      this.data = [];
      this.data.push(processRow)
    }
  
    this.sections.add(data.stage)
    this.newSec=[...this.sections]
    this.showStepModal=false;
    this.stepName='';
    this.step_description='';
    this.stage='';
    this.files=[];
    this.skills.clear();
    this.bounty=''
  }
  cancelStep(){
    if(confirm("You are going to close the window without having saved the process edits?")){
      this.stepName='';
      this.step_description='';
      this.stage='';
      this.files=[];
      this.skills.clear();
      this.bounty=''
      this.showStepModal=false;
      return

    }
  }

  deleteProcess(value){
    this.data=this.data.filter(x=>x._id!=value._id);
  }
  error_skills=false;
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.newSec, event.previousIndex, event.currentIndex);
  }
  addSkillPopup=false
  skillAdd(){
    this.addSkillPopup=true
  }
  
  skillAdd2(){
    this.addSkillPopup=true
  }
  slectedSkill=''
  skills=new Set("");
  onSelected($event){
    this.skills.add($event.target.value)
  }
  onSelected2($event){
    let skill=new Set(this.editSkills);
    skill.add($event.target.value);
    this.editSkills=[...skill];
    //this.skills.add($event.target.value)
  }
  newSkill;
  SaveFuncCancle(){
    this.addSkillPopup=false;
    this.error_skills= false;
    this.newSkill=''
  }
  savesuccess=false;
  SaveFunc(){
    if (!this.newSkill) {
      this.error_skills = true
      return
    } else {
      this.error_skills = false
    }
    this.sData.unshift(this.newSkill)
    this.addSkillPopup=false;
    this.error_skills= false;
    this.savesuccess=true
    this.newSkill=''

  }
  showme(){
    this.initialNone=false;
  }
  enableTextArea=false;
  currentProcDesc="";
  stepProcess(proc,i){
    this.stepChecked(proc);
    this.currentProcDesc=proc.step_description;
    this.enableTextArea=true;
    this.index=i;
    this.enablebounty=false;
    this.enableSuggestedBounty=false;
    this.enableStep=false;
  }
  enablebounty=false;
  currentBountyData='';
  index=null;
  fncEnablebounty(proc,i){
    this.stepChecked(proc);
    this.currentBountyData=proc.bounty;
    this.index=i;
    this.enablebounty=true
    this.enableTextArea=false;
    this.enableSuggestedBounty=false;
    this.enableStep=false;

  }
  showEditStepModal=false
  idx;
  editStep
  editdes;
  editfilles=[];
  editskills=new Set("");
  editbounty
  editstage;
  currentProc;
  defaultSkills;
  editSkills=[];
  showEditStepModalFnc(value,proc){
  this.idx=value;
  this.currentProc=proc;
  this.defaultSkills=proc.skills;
  this.editStep=proc.step;
  this.editdes=proc.step_description;
  this.editfilles=proc.files;
  this.editSkills=proc.skills
  console.log(this.editSkills)
  this.editbounty=proc.bounty;
  this.editstage=proc.stage;
  this.filterStage(this.editstage);
  this.showEditStepModal=true;
  }
  cancelEditStepModal(){
    if(confirm( "You are going to close the window without having saved the process edits")){
      this.showEditStepModal=false;
      this.editSkills=[];
    }
  }
  saveEditStepModal(){
    this.error_bounty=false;
    this.error_stage=false;
    this.error_name=false;
    this.error_des=false;
    if(!this.editdes){
      this.error_des=true;
      return
    }
    if(!this.editStep){
      this.error_name=true;
      return
    }
    if(!this.editstage){
      this.error_stage=true;
      return
    }
    if(!this.editbounty){
      this.error_bounty=true;
      return
      
    }

    this.currentProc.step=this.editStep;
    this.currentProc.step_description=this.editdes
    this.currentProc.files=this.editfilles;
    this.currentProc.skills=[...this.editSkills]
    this.currentProc.bounty=this.editbounty
    this.currentProc.stage=this.editstage
   this. showEditStepModal=false;
   //this.sections.add(this.editstage)
   console.log(this.sections,this.editstage);
  }
  enableSuggestedBounty=false;
  currentSuggestedBountyData
  fncSuggestedBounty(proc,i){
    this.stepChecked(proc);
    this.index=null;
    this.currentSuggestedBountyData=proc.suggested_bounty;
    this.enableSuggestedBounty=true;
    this.index=i;
    this.enableTextArea=false;
    this.enablebounty=false;
    this.enableStep=false;


  }
  enableStep=false;
  currentProcName;
  stepProcessName(proc,i){
    this.stepChecked(proc);
    this.index=i;
    this.enableStep=true;
    this.currentProcName=proc.step;
    this.enableTextArea=false;
    this.enablebounty=false;
    this.enableSuggestedBounty=false;
  }
  filteredStages=[];
  filterStage(value){
    this.filteredStages=[...this.sections];
    this.filteredStages=this.filteredStages.filter(x=>x!==value);
  }
  onSelectedStage($event){
    this.editstage=$event?.target?.value;
    // this.currentProc.stage=this.stage;
    // console.log("satge",this.stage)
  }
  onSelectedStage2($event){
    this.stage=$event?.target?.value;
    // this.currentProc.stage=this.stage;
    // console.log("satge",this.stage)
  }
  changeEvent($event){
    if(!$event.target.checked){
      let skill=[...this.skills]
      skill=skill.filter(x=>x!==$event.target.value);
      this.skills=new Set(skill)
    }
  }
  changeEvent2($event){
    if(!$event.target.checked){
      this.editSkills=this.editSkills.filter(x=>x!==$event.target.value);
      console.log($event.target.value)
    }
  }
  newAddStageData='';
  error_newAddStageData=false;
  addStagePopup=false;
  stageAddModal(){
    this.addStagePopup=true;
  }
  SaveStageFunc(){
    this.error_newAddStageData=false;
    if(this.newAddStageData?.length<=0){
      this.error_newAddStageData=true;
    }
    else{
      this.sections.add(this.newAddStageData);
      this.addStagePopup=false;
    }
  }
  SaveStageFuncCancle(){
    this.newAddStageData='';
    this.addStagePopup=false;
  }

  newAddEditStageData=''
  addEditStagePopup=false;
  error_newAddEditStageData=false;
  showEditSatageModal(){
    this.addEditStagePopup=true;
  }
  SaveStageFuncEditCancle(){
    this.addEditStagePopup=false;
    this.newAddEditStageData='';
  }
  SaveStageEditFunc(){
    this.error_newAddEditStageData=false;
    if(this.newAddEditStageData?.length<=0){
      this.error_newAddEditStageData=true
      console.log('yahoo')
    }
    else{
      let stage=new Set(this.filteredStages)
      stage.add(this.newAddEditStageData);
      this.filteredStages=[...stage];
      this.newAddEditStageData='';
      this.addEditStagePopup=false
    }

  }
}
