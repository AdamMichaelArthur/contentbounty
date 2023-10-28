import { Component, OnInit, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { FlexibleComponent } from '../flexible-table/flexible-table.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BaseComponent } from '../base/base.component';
import { Router } from '@angular/router'
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../user-registration/register.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})

export class TeamComponent extends BaseComponent implements OnInit {

  viewMode = 'keyword';
  
  keywordInput: any = "test"
  userSkills: any = [ ];

  //private flexTable: FlexibleComponent;
  public errorText: string;
  ifErrorMessage = false
  ifSuccessMessage = false
  select_default_val = null;
  adam: string = "adam test"
  isLoading: boolean = false
  addTeamMemberForm: UntypedFormGroup;
  submitted = false

  constructor(
    public service: BaseService, 
    public elementRef: ElementRef, 
    public router: Router, 
    public sharedService: SharedService,
    private formBuilder: UntypedFormBuilder) {
    super(service, elementRef)
    this.errorText = '';
  }

  ngOnInit() {
    super.ngOnInit()
    this.service.key = "user"
    
    setInterval(() => {
      this.ifErrorMessage = false
      this.ifSuccessMessage = false
    }, 30000)

    this.service.getDistinctArray("skills", "skills", true).subscribe(data => {
      this.userSkills = this.userSkills.concat(data)
    })

    this.addTeamMemberForm = this.formBuilder.group({
      first_name: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)])
      ],
      last_name: [
        '',
        Validators.minLength(4)
      ],
      email: [
        '',
        Validators.compose([Validators.required, Validators.email])
      ],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      confirm_password: ['', Validators.required],
      skill: ['', Validators.required],
      req_change_password: [false, Validators.required]
    }, {
      validator: MustMatch('password', 'confirm_password')
    });
  }

  get f() {
    return this.addTeamMemberForm.controls;
  }

  // public team = {
  //   'first_name': '',
  //   'last_name': '',
  //   'email': '',
  //   'pwd': '',
  //   'cfpassword': '',
  //   'change_password': '',
  //   'skill': ''
  // }

  // onSelected(value) {
  //   console.log(490, value);
  //   this.team.skill = value;
  //   console.log(value)
  // }

  // flextableHeaderButtonClicked(event){

  //   console.log(102, this.addTeamMemberForm)
  // }

  updateSkill(value){
    this.f.skill.setValue(value)
    this.f.skill.setErrors(null)
  }

  addUser() {
    this.submitted = true
    if(this.addTeamMemberForm.invalid)
    {
      console.log(126, this.f.req_change_password.value)
    }
    else
    {
      // console.log(104, this.addTeamMemberForm)
      console.log(120, this.f.req_change_password.value)
      var body = {
        'first_name': this.f.first_name.value,
        'last_name': this.f.last_name.value,
        'email': this.f.email.value,
        'pwd': this.f.password.value,
        'cfpassword': this.f.confirm_password.value,
        'change_password': this.f.req_change_password.value,
        'skill': this.f.skill.value
      }
      this.service.addTeamUser(body).subscribe(
        (data:any) => {
          if (data.Result === 'Failure') {
            console.log(132, data)
            this.isLoading = false;
            this.ifErrorMessage = true;
            this.errorText = data.ErrorDetails.Description
            this.addTeamMemberForm.reset()
            // this.addTeamMemberForm.controls['req_change_password'].setValue(false)
            this.submitted = false
          }
          else
          {
            console.log(132, data)
            //   if(data["Error"] != 0){
            //     return this.handleError(data["ErrorDetails"])
            //   }

            this.isLoading = false;
            this.ifSuccessMessage = true;
            this.errorText = 'User Added Successfully!'
            this.hidePopup()
            this.flexTable.refreshTableData()
            // setTimeout(() => {
            //   this.displayButtonArea = true
            //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //     this.router.navigate(['/team']);
            //   }); 
            // }, 2000)
          }
        },
        (error)=>{
          console.log(151, error.description)
          this.isLoading = false;
          this.ifErrorMessage = true;
          this.errorText = 'User Adding failed!'
          
        })
    }
    // if (this.team.first_name && this.team.last_name && this.team.email && this.team.pwd && this.team.cfpassword && (this.team.pwd == this.team.cfpassword) && this.team.skill) {
    //   this.service.addTeamUser(this.team).subscribe(data => {
    //     if (data) {
    //       console.log(data)
    //       //   if(data["Error"] != 0){
    //       //     return this.handleError(data["ErrorDetails"])
    //       //   }

    //       this.isLoading = false;
    //       this.ifSuccessMessage = true;
    //       this.errorText = 'User Added Successfully!'
    //       setTimeout(() => {
    //         this.displayButtonArea = true
    //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //           this.router.navigate(['/team']);
    //         }); 
    //       }, 2000)

    //       //   this.team.first_name = ''
    //       //   this.team.last_name = ''
    //       //   this.team.email = ''
    //       //   this.team.pwd = ''
    //       //   this.team.cfpassword = ''
    //       //   this.team.change_password = ''
    //       //   this.team.skill = ''
    //       //   this.flexTable.refreshTableData();
    //       // }else{
    //       //   console.log("Password Added Faile!")
    //     }
    //   })
    // } else {
    //   if (this.team.first_name == '') {
    //     this.ifErrorMessage = true
    //     this.errorText = 'First Name is required.'
    //   } else {
    //     if (this.team.last_name == '') {
    //       this.ifErrorMessage = true
    //       this.errorText = 'Last Name is required.'
    //     } else {
    //       if (this.team.email == '') {
    //         this.ifErrorMessage = true
    //         this.errorText = 'Email is required.'
    //       } else {
    //         if (this.team.pwd == '') {
    //           this.ifErrorMessage = true
    //           this.errorText = 'Password is required.'
    //         } else {
    //           if (this.team.pwd.length < 4) {
    //             this.ifErrorMessage = true
    //             this.errorText = 'Password must be at least 4 characters long.'
    //           } else {
    //             if (this.team.cfpassword == '') {
    //               this.ifErrorMessage = true
    //               this.errorText = 'Confirm Password is required.'
    //             } else {
    //               if (this.team.pwd != this.team.cfpassword) {
    //                 this.errorText = 'Confirm Pasword Not Match'
    //                 console.log("Confirm Pasword Not Match")
    //                 this.ifErrorMessage = true
    //               } else {
    //                 if (this.team.skill == '') {
    //                   this.ifErrorMessage = true
    //                 } else {
    //                   if (this.team.skill == '') {
    //                     this.ifErrorMessage = true
    //                     this.errorText = 'Skill require!'
    //                   } else {
    //                     if (this.team.skill != '') {
    //                       this.isLoading = true;
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }

  // handleError(err) {
  //   console.log(109, err)
  //   if (err.Error == 11000) {
  //     this.ifErrorMessage = true
  //     this.errorText = err.Description
  //   } else {
  //     this.ifErrorMessage = true
  //     this.errorText = "There was a problem creating this account"
  //   }
  // }
  hidePopup() {
    this.displayButtonArea = !this.displayButtonArea
    this.addTeamMemberForm.reset()
    this.addTeamMemberForm.controls['req_change_password'].setValue(false)
    this.submitted = false
  }

  // matchPassword
  // matchPassword() {
  //   console.log(this.team.pwd)
  //   console.log(this.team.cfpassword)
  //   if (this.team.pwd != this.team.cfpassword) {
  //     console.log("Dont match")

  //     this.errorText = "Password does not match"
  //     this.ifErrorMessage = true
  //   }
  // }

  dragFrom: string = "";

  onDragStart(e){
    console.log(399, "onDragStart");
  }

  onDropEvent(e){
    //e.preventDefault();
    console.log(419, "onDropEvent");
  }

  onDragEnd(e){
    console.log(403, "onDragEnd");
    this.dragFrom = "";
  }

  //Add Prompts end
  drop(event: CdkDragDrop<string[]>) {

    this.sharedService.drop(event);
  }

  onDragOver(e){
    if(this.dragFrom == e.key){
      e.event.preventDefault();  
    }
  }

  onDragEnter(e){
    //console.log(407, "onDragEnter");
  }

  onDragLeave(e){
    console.log(411, "onDragLeave");
  }

  refreshTable() {
    console.log(84,"compoennt refreshTable called");
    this.flexTable.getInitialDataTableList()
  }

  refreshFlextable(){
    console.log(321, "super refresh flextable called");
    this.refreshTable()
  }

  dragStart(ev, dragType, data) {

    ev.target.id = "taskid";
    if(dragType == 'add_skill'){
      this.dragFrom = "skill"
    }

    var dropOriginData = {
      dragType: dragType,
      droppedData: data
    }
    
    console.log(205, "dragStart", dropOriginData)

    ev.dataTransfer.setData("taskItem", ev.target.id);
    ev.dataTransfer.setData("dropOriginData", JSON.stringify(dropOriginData));
  }

  dropItemReceived($event: any) {
     console.log(340, "dropItemReceived", $event["droppedData"]);

     var _id = $event["_id"];
     if($event.dragType == "add_skill"){
       this.pushValueIntoArray(_id, "skill", $event["droppedData"], false);
       const index = this.userSkills.indexOf($event["droppedData"]);
        if (index > -1) {
           //this.userSkills.splice(index, 1);
           //this.refreshFlextable()
        }
     }
  }

  changeUserRole($event: any, $value){

    console.log(360, this.response, $value.srcElement.value)
    var user_id = $event._id;

    var editData = {
      "key":"role",
      "value":$value.srcElement.value
    }
    if(editData.value == "Select Role")
      return;

    this.service.editDataById(this.response.user_id, editData).subscribe(
      (data: any) => {
        this.tableButtonSubviews[0] = false;
        this.displayTableButtonArea = false;
        this.refreshFlextable()
      }
    )

  }
  hideUserRoleSelectPopup(){
    this.displayTableButtonArea = false;
  }
}