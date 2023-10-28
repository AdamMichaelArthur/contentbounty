import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-generator',
  templateUrl: './form-generator.component.html',
  styleUrls: ['./form-generator.component.css']
})
export class FormGeneratorComponent implements OnInit, OnChanges {

  @Input() formDetail: any
  @Input() formType: any;
  @Output() emitFormData = new EventEmitter<any>();
  submitted = false
  number_of_dropdowns: any;
  dropdowns = [];
  displayElement = true

  constructor(private formBuilder: UntypedFormBuilder) {
  }

  ngOnChanges(){
    this.dynamicForm.reset()
    this.addItems()
    this.submitted = false
    console.log(24, this.dynamicForm.controls['number_of_dropdowns'])
  }

  ngOnInit(): void {
    console.log(27, this.formType)
  }

  /*################ datasourceFormDynamic Form ################*/
  dynamicForm = this.formBuilder.group({})
  addDropdownForm = this.formBuilder.group({})

  /*############### Add Dynamic Elements in datasourceFormDynamic ###############*/
  get addDynamicElement() {
    return this.dynamicForm as UntypedFormGroup
  }

  get addDynamicDropDownElement() {
    return this.addDropdownForm as UntypedFormGroup
  }

  submitForm(form: any){
    this.submitted = true;
    switch(this.formType){
      case 'addButton': {
        if(form.invalid)
        {
          console.log(form)
          this.submitted = true;
        }
        else
        {
          this.submitted = false
          this.emitFormData.emit(form)
          this.dynamicForm.reset()
        }
        break;
      }
      case 'addDropdown': {
        if(form.invalid)
        {
          this.submitted = true;
        }
        else
        {
          this.number_of_dropdowns = form.controls.number_of_dropdowns.value
          this.createAddDropDownForm(this.number_of_dropdowns)
        }
      }
      default: { 
        break; 
      } 
    }
  }

  createAddDropDownForm(number_of_dropdowns){
    for (let i = 1; i <= number_of_dropdowns; i++) {
        var fieldName = 'dropdown_'+ String(i)
        this.dropdowns.push({
          "fieldName": fieldName,
          "fieldType": "text",
          "fieldLevel": fieldName.replace('_', ' ')
        })
        console.log(fieldName)
          this.addDynamicDropDownElement.addControl(
            fieldName,
            new UntypedFormControl(
              '', [Validators.required, Validators.minLength(4)] 
            )
          );
    }
    this.displayElement = false
    this.submitted = false
    // this.formType = 'submitDropdownForm'
  }

  submitDropdownForm(form: any){
    if(form.invalid)
    {
      this.submitted = true
    }
    else
    {
      this.submitted = false
      this.emitFormData.emit(form)
      this.addDropdownForm.reset()
    }
  }

  addItems() {

    for (let i = 0; i < this.formDetail.length; i++) {
      if (this.formDetail[i].fieldType == 'boolean') {
        this.addDynamicElement.addControl(
          this.formDetail[i].fieldName,
          new UntypedFormControl(
            false
          )
        );
      }
      else {
        if(this.formDetail[i].validation)
        {
          if(this.formDetail[i].validation.required)
          {
            this.addDynamicElement.addControl(
              this.formDetail[i].fieldName,
              new UntypedFormControl(
                '', [Validators.required] 
              )
            );
            if(this.formDetail[i].validation.pattern)
            {
              console.log(136, "test")
              this.addDynamicElement.get(this.formDetail[i].fieldName).setValidators([
                Validators.pattern(this.formDetail[i].validation.pattern),
                this.addDynamicElement.get(this.formDetail[i].fieldName).validator
              ]);
            }
            if(this.formDetail[i].validation.minLength)
            {
              this.addDynamicElement.get(this.formDetail[i].fieldName).setValidators([
                Validators.minLength(this.formDetail[i].validation.minLength),
                this.addDynamicElement.get(this.formDetail[i].fieldName).validator
              ]);
            }
          }
          else
          {
            if(this.formDetail[i].validation.pattern){
              this.addDynamicElement.addControl(
                this.formDetail[i].fieldName,
                new UntypedFormControl(
                  '', [Validators.pattern(this.formDetail[i].validation.pattern)] 
                )
              );
            }
          }
        }
        else {
          this.addDynamicElement.addControl(
            this.formDetail[i].fieldName,
            new UntypedFormControl(
              ''
            )
          );
        }
      }
    }
  }

}
