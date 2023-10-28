
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,

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
import {
  MenuComponentService
} from './menu-component-service';

import { BaseService } from '../base/base.service'
import { BaseComponent } from '../base/base.component';
import { SharedService } from '../../_services/shared.service'
import { Router, CanActivate, NavigationEnd } from '@angular/router';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'menu-component',
  templateUrl: './menu-component.html',
  styleUrls: ['./menu-component.css']
})
export class MenuComponent extends BaseComponent implements OnInit {
  form: UntypedFormGroup;
  key: any = "salma";
  viewMode = 'skills'

  currentRoute: string;

  constructor(
    private flexService: FlexibleTableService, public siteService: MenuComponentService,
    formBuilder: UntypedFormBuilder,
    fb: UntypedFormBuilder,
    public service: BaseService,
    public elementRef: ElementRef,
    private router: Router,
    public sharedService: SharedService
  ) {
    super(service, elementRef)
    this.form = new UntypedFormGroup({
      checkArray: new UntypedFormControl([], [Validators.required])
    })

    this.currentRoute = this.router.url.substring(1)
    this.route = this.currentRoute

  }

  ngOnInit() {
    super.ngOnInit()
    this.getMenus()
  }

  refreshTable() {
    this.flexTable.getInitialDataTableList()
  }

  buttonClick = false
  account_type = "";
  action = "Add"
  preposition = "To"
  displayTitle = true;
  submenu = false;

  viewPopup(account_type, action ="Add", submenu =false) {
    console.log(83, account_type, action);
    this.account_type = account_type;
    if(action != 'Add'){
      this.action = action;
      this.preposition = "From"
      this.displayTitle = false;
    } else {
      this.action = "Add";
      this.preposition = "To"
      this.displayTitle = true;
    }
    if(submenu != false){
      this.submenu = true;
    }
    this.buttonClick = !this.buttonClick
  }
  menus = []
  data: any

  getMenus() {
    this.siteService.get_menu().subscribe(
      (data: any) => {
        this.menus = data.sidebarnavs
        this.data = data
        console.log("ppppp", this.menus)
      })
  }

  pri_page() {
    console.log(this.data)
    this.siteService.get_menu_pagination(this.data.pagination.prev_page_endpoint).subscribe(
      (data: any) => {
        this.menus = data.sidebarnavs
        this.data = data
      })
  }
  next_page() {
    console.log(this.data)
    this.siteService.get_menu_pagination(this.data.pagination.next_page_endpoint).subscribe(
      (data: any) => {
        this.menus = data.sidebarnavs
        this.data = data
      })
  }

  deleteMenu(menu: any) {
    var body = {
      account_type: "admin",
      title: menu.title
    }
    console.log(menu)
    this.siteService.deleteMenu(body).subscribe(
      (data: any) => {
       console.log("PLPLPLPPP......")
      })
  }

  editMenu(menu: any) {

  }

  route: any = ''
  title: any = ''
  icon: any = ''
  role: any = ''
  route_error = false
  title_error = false
  add_menu() {

    var api_endpoint = "";

    switch(this.account_type){
      case "authority":
        api_endpoint = "updateauthorityaccounts"
        break;
      case "admin":
        api_endpoint = "updateadminaccounts"
        break;
      case "creator":
        api_endpoint = "updatecreatoraccounts"
        break;
    }

    if(api_endpoint == ""){
      // There was an error
      console.log(153, "Unexpected error");
      return;
    }


    // if (this.route === '') {
    //   this.route_error = true
    // } else {
    //   this.route_error = false
    // }
    // if (this.title === '') {
    //   this.title_error = true
    // } else {
    //   this.title_error = false
    // }

    var body;
    if (!this.route_error && !this.title_error) {
      body = {
        role: this.role,
        route: this.route,
        title: this.title,
        icon: this.icon
      }

      if(this.action == 'Remove'){
        api_endpoint = 'remove'
        body = {
          "account_type": this.account_type,
          "title":this.title
        }
      } 

      console.log(76, body, api_endpoint)
    this.siteService.add_menu(body, api_endpoint).subscribe(
        (data: any) => {
          this.role = "all",
          this.route = '',
          this.title = ''
          this.buttonClick = false
        })
    }
  }
}


