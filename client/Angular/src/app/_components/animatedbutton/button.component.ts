import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Globals } from 'src/app/globals';


@Component({
  selector: 'animatedbutton',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})

export class AnimatedButtonComponent implements OnInit {

  @Input() buttom_Config: any;
  @Input() isloader: any;
  @Output() textBtnClickEmt: EventEmitter<string> = new EventEmitter<string>();
  @Output() imgBtnClickEmt: EventEmitter<string> = new EventEmitter<string>();
  @Output() salmBtnClickEmt: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('testForm') testFormElement;

  constructor(public globalVars: Globals) {}

  isLoading = this.globalVars.isLoadingButton;

  disabled = this.globalVars.disableLoadingButton;
  
  ngOnInit() {
     this.isloader = true;
     this.isLoading = this.globalVars.isLoadingButton;;

     console.log(32, this.buttom_Config)
  }

  test(){
    console.log(33);
  }

  clicked($event){

    // if(this.isLoading)
    //   this.disabled = true;
    this.isLoading = true;
    this.globalVars.isLoadingButton = true;
    this.disabled = true;
    this.globalVars.disableLoadingButton = true
    // this.disabled = true;
    this.textBtnClickEmt.emit("submit Button Clicked")
    console.log(29, $event)
     //console.log(36, this.testFormElement.nativeElement);
  }

  onTextBtnClick() {
    console.log(24)
    this.textBtnClickEmt.emit('You have clicked on a text button.');
    this.globalVars.isLoadingButton = !this.globalVars.isLoadingButton
    this.isLoading = !this.isLoading
  }

  onImgBtnClick() {
    console.log(31)
    this.imgBtnClickEmt.emit('You have clicked on an image button.');
    this.globalVars.isLoadingButton = !this.globalVars.isLoadingButton
    this.isLoading = !this.isLoading
  }

  onSalmaBtnClick1() {
    console.log(37)
    this.salmBtnClickEmt.emit('You have clicked on an salma button.');
    this.globalVars.isLoadingButton = !this.globalVars.isLoadingButton
    this.isLoading = !this.isLoading
  }

  //isLoading = this.globalVars.isLoadingButton
}