import { Component, OnInit, ViewChild, AfterViewInit,HostListener } from '@angular/core';
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
  PopStateEvent
} from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import { Globals } from 'src/app/globals';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})

export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(public location: Location, private router: Router, public globalVars: Globals, public appComponent: AppComponent) {}

  wt: any;

  @HostListener('window:resize', ['$event'])
  sizeWindow(event) {
    this.wt = event.target.innerWidth;
  }

  ngOnInit() {
    const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;
    
    this.mobile_test()
    this.globalVars.global_loader = false;
    console.log("try Loader from admin: " + this.globalVars.global_loader)
  }

  mobiletest = false
  mobile_test(){
      if(this.wt ===991 || this.wt >991){
          this.mobiletest =true
      }
  }

  cancelNotification() {
    this.globalVars.show_notification = false;
    console.log("try: " + this.globalVars.show_notification)
  }


  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  
  isMac(): any {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
      navigator.platform.toUpperCase().indexOf('IPAD') >= 0
    ) {
      bool = true;
    }
    return bool;
  }
  show:any= false;

  testt = false;
  test(){
    this.testt= !this.testt;
    console.log("Thi sis test")
  }
}
