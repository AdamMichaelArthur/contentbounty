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

import { BaseService } from '../base/base.service'
import { BaseComponent } from '../base/base.component';
import { SharedService } from '../../_services/shared.service'
import { Router, CanActivate } from '@angular/router';
import { DeveloperTaskService } from './developer-task.service';
//import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-developer-task',
  templateUrl: './developer-task.component.html',
  styleUrls: ['./developer-task.component.css']
})
export class DeveloperTaskComponent extends BaseComponent implements OnInit {

  iconMenusStr = "";
  iconMenuRoutesStr = "";
  form: UntypedFormGroup;


  constructor(
    private flexService: FlexibleTableService,
    formBuilder: UntypedFormBuilder,
    fb: UntypedFormBuilder,
    public service: BaseService,
    public elementRef: ElementRef,
    private router: Router,
    public sharedService: SharedService,
    private devservice:DeveloperTaskService
  ) {
    super(service, elementRef)
    this.form = new UntypedFormGroup({
      checkArray: new UntypedFormControl([], [Validators.required])
    })
  }


  ngOnInit(): void {
    super.ngOnInit()
  }

  add_description: any = '';
  add_step_text_area: any = '';
  error_des = false
  error_add_step_text_area = false
  task_name_error = false
  task_name = ''
  task_deatils_descrption_error = false
  task_deatils_descrption = ''
  user_name_error:boolean=false;
  user_phone_error:string="";
  user_name:string="";
  user_email = '';
  user_email_error:boolean=false;
  user_mobile = '';
  user_mobile_error:boolean=false;
  user_url = '';
  user_url_error = false
  require_login = false;
  require_login_error = false



  onBlurMethodpress(value: any) {
    
    
    if (this.add_description === '') {
      this.error_des = true;
    } else {
      this.error_des = false;
    }
    console.log(this.add_description)

    if (value == 'task_name') {

      if (this.task_name === '') {
        this.task_name_error = true
      } else {
        this.task_name_error = false
      }

    }


    if (value == 'task_deatils_descrption') {
      if (this.task_deatils_descrption === '') {
        this.task_deatils_descrption_error = true
      } else {
        this.task_deatils_descrption_error = false

      }

    }

    if(value=="user_name"){
      this.user_name_error=true;
      if(this.user_name){
        this.user_name_error=false;
      }
      
    }
    if(value=="user_mobile"){
      this.user_mobile_error=true;
      if(this.user_mobile){
        this.user_mobile_error=false;
      }
      
    }
    if(value=='user_email'){
      this.user_email_error=true;
      if(this.user_email){
        this.user_email_error=false;
      }
      
    }

  }

  onBlurMethod(value: any) {
    if (value == 'task_name') {
      this.task_name_error = true
      if (this.task_name!= '') {
        this.task_name_error = false

      }
    }

    if (value == 'task_deatils_descrption') {
      this.task_deatils_descrption_error = true

      if (this.task_deatils_descrption != '') {
        this.task_deatils_descrption_error = false

      }
    }

    if(value=="user_name"){
      this.user_name_error=true;
      if(this.user_name){
        this.user_name_error=false;
      }
      
    }
    if(value=="user_mobile"){
      this.user_mobile_error=true;
      if(this.user_mobile){
        this.user_mobile_error=false;
      }
      
    }
    if(value=='user_email'){
      console.log(value);
      this.user_email_error=true;
      if(this.user_email){
        this.user_email_error=false;
      }
      
    }
    
  }
  buttonForm = false
  add_task() {
    if (this.require_login === false) {
      this.require_login_error = true
    }
    if (this.task_name === '') {
      this.task_name_error = true
    }

    if (this.task_deatils_descrption === '') {
      this.task_deatils_descrption_error = true
    }
    if(!this.user_email){
      this.user_email_error=true;
    }
    if(!this.user_name){
      this.user_name_error=true;
    }
    if(!this.user_mobile){
      this.user_mobile_error=true;
    }
    if (this.task_name != '' && this.task_deatils_descrption != '') {
      this.user_url_error = false
      this.user_email_error = false
      this.user_mobile_error = false

      this.task_deatils_descrption_error = false
      this.task_name_error = false
      this.require_login_error = false

      var body = {
        task_name: this.task_name,
        user_name:this.user_name,
        user_email: this.user_email,
        user_mobile: this.user_mobile,
        description: this.task_deatils_descrption,
      }
      console.log(body);
      this.devservice.addDataToSourceForm('devtask', body).subscribe(
        (data: any) => {
          this.task_name = '';
          this.user_name ='';
          this.user_email = '';
          this.user_mobile= '';
          this.task_deatils_descrption = '';
        })
    }

  }
 
}
