import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//let Calendly:any

@Component({
  selector: 'app-writer-application',
  templateUrl: './writer-application.component.html',
  styleUrls: ['./writer-application.component.scss']
})
export class WriterApplicationComponent implements OnInit {

  constructor() { }

  //@ViewChild('calendly') calendly: ElementRef;

  ngOnInit(): void {
    // Calendly.initInlineWidget({
    //   url: 'https://calendly.com/inbrain-bd/15min',
    //   parentElement: this.calendly.nativeElement
    // });
  }

  files: any = [];
  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }  
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }


  // Slider
  slideDefault:boolean = true;

  slideLeftView1:boolean = false;
  slideRightView1:boolean = false;

  slideLeftView2:boolean = false;
  slideRightView2:boolean = true;

  slideLeftView3:boolean = false;
  slideRightView3:boolean = true;

  slideLeftView4:boolean = false;
  slideRightView4:boolean = true;

  slideLeftView5:boolean = false;
  slideRightView5:boolean = true;

  next1(){
    this.slideLeftView1 = true;
    this.slideRightView2 = false;
  }
  next2(){
    this.slideLeftView2 = true;
    this.slideRightView3 = false;
  }
  next3(){
    this.slideLeftView3 = true;
    this.slideRightView4 = false;
  }
  next4(){
    this.slideLeftView4 = true;
    this.slideRightView5 = false;
  }
  // End For Slider

}
