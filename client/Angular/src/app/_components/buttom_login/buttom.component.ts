import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Globals } from 'src/app/globals';


@Component({
  selector: 'app-LoginComponent',
  templateUrl: './buttom.component.html',
  styleUrls: ['./buttom.component.scss']
})

export class ButtomLoginComponent implements OnInit {
  @Input() buttom_Config: any;
  @Input() isloader: any;
  @Output() textBtnClickEmt: EventEmitter<string> = new EventEmitter<string>();
  @Output() imgBtnClickEmt: EventEmitter<string> = new EventEmitter<string>();
  @Output() salmBtnClickEmt: EventEmitter<string> = new EventEmitter<string>();

  constructor(public globalVars: Globals) {}

  ngOnInit() {}

  onTextBtnClick() {
    this.textBtnClickEmt.emit('You have clicked on a text button.');
    this.isLoading = !this.isLoading

  }

  onImgBtnClick() {
    this.imgBtnClickEmt.emit('You have clicked on an image button.');
    this.isLoading = !this.isLoading
  }

  onSalmaBtnClick1() {
    this.salmBtnClickEmt.emit('You have clicked on an salma button.');
    this.isLoading = this.globalVars.isLoadingButton
  }

  isLoading = this.globalVars.isLoadingButton
}