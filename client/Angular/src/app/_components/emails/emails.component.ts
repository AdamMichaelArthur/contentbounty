
import { Component, OnInit, Input, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { Location } from '@angular/common'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css']
})
export class EmailsComponent extends BaseComponent implements  OnInit {

  constructor(public service: BaseService, public elementRef: ElementRef,
    public sharedService: SharedService, private location: Location, private formBuilder: UntypedFormBuilder){
  	super(service, elementRef)
  }


  textCutoff = [50, 20, 20]

  addGmailForm: UntypedFormGroup;
  filterStr = "";

  ngOnInit(): void {

    console.log(24, this.sharedService._id);

    this.addGmailForm = this.formBuilder.group({
      first: [
        ''],
      last: [
        ''
      ],
      email: [
        ''
      ]
    });

    this.filterStr = `{ "brand_id": "${this.sharedService._id}" }`
    console.log(39, this.filterStr);
  }

  gmail_url = "";

  addGmail(){
    console.log(38, "Submit", this.addGmailForm.value)

    var gmailInfo = {
      ... this.addGmailForm.value,
      "brand_id": this.sharedService._id
    }
    console.log(51, gmailInfo);
    this.service.linkGmail(gmailInfo).subscribe((data: any) => {
        this.gmail_url = data.integrations.authURL;
        window.location.href = this.gmail_url;
        console.log(44, this.gmail_url);
      })
  }

  linkGmail() {
  	
  }

}
