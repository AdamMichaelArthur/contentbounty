// Input, ViewChild
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'

@Component({
  selector: 'app-siteadmin-creators',
  templateUrl: './siteadmin-creators.component.html',
  styleUrls: ['./siteadmin-creators.component.css']
})

export class SiteadminCreatorsComponent extends BaseComponent implements OnInit {

  iconMenus = [
    {
      "icon":"local_phone",
      "menu_label":"Send Text Message",
      "identifier":"sendsms"
    },
    {
      "icon":"email",
      "menu_label":"Send Email",
      "identifier":"sendemail"
    }
  ]

  filters = [
    {
      "filter": { "account_type":"$colors"},
      "label": "Account Type",
      "valueKeys": [],
      "valueIds": [],
      "datasource": "users",
      "key": "account_type",
      "distinct": "account_type"
    }
  ]

  //import { BaseService } from '../base/base.service'
  constructor(public service: BaseService, public elementRef: ElementRef) {
    super(service, elementRef) 
  }

  ngOnInit() {
    super.ngOnInit()
  }

}
