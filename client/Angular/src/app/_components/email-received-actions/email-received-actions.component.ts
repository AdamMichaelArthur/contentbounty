import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, NgForm, Validators, UntypedFormBuilder } from '@angular/forms';


@Component({
  selector: 'app-email-received-actions',
  templateUrl: './email-received-actions.component.html',
  styleUrls: ['./email-received-actions.component.css']
})

export class EmailReceivedActionsComponent implements OnInit {

  @Input() buttons: any
  @Output() buttonClickEvent = new EventEmitter<any>();
  @Output() selectChangeEvent = new EventEmitter<any>();

  formDetail: any;
  displayAddFormArea = false
  formType: any;
  dropdowns = []

  // form generator data
  addButtonFormDetail = [
    {
      "fieldLevel": "Button Level",
      "fieldName": "button_level",
      "fieldType": "text",
      "validation": {
        "required": true,
        "minLength": 4
      }
    }
  ]

  addDropDownFormDetail = [
    {
      "fieldLevel": "Number of DropDowns",
      "fieldName": "number_of_dropdowns",
      "fieldType": "number",
      "validation": {
        "required": true,
        "pattern": "^[0-9]*$"
      }
    }
  ]

  addButton(buttonName){
    console.log(45, buttonName);

    var form = {
      formType: "addButton",
      buttonValue: buttonName
    }
    this.buttons.push(form)
  }

  removeButton(buttonName){

  }

  displayAddForm(whichForm){
    switch(whichForm){
      case 'addButton': {
        this.formDetail = this.addButtonFormDetail
        break;
      }
      case 'addDropdown': {
        this.formDetail = this.addDropDownFormDetail
        break;
      }
      default: { 
        break; 
      } 
    }
    this.formType = whichForm
    this.displayAddFormArea = true;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(82, this.buttons);
  }

  raiseEvent(type, value){
    if(type == 'normal'){
      this.buttonClickEvent.emit(value)
    }
    else
    {
      this.selectChangeEvent.emit(value)
    }
    console.log("test", type, value)
  }

  receieveFormData(data){
    this.displayAddFormArea = !this.displayAddFormArea
    console.log(this.formType)
    if(this.formType == 'addButton'){
      this.buttons.push({ 'buttonValue': data.controls.button_level.value,
                          "buttonType":"normal"
                        })

    // {
    //   "buttonValue": "Unrelated To Links",
    //   "buttonType":"normal"
    // }
    }
    if(this.formType == 'addDropdown'){
      let dropdown = []
      Object.keys(data.controls).forEach(key => {
        let value = data.controls[key].value
        dropdown.push(value)
      });
      this.dropdowns.push(dropdown)
    }
  }
}
