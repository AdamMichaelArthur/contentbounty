import { Component, OnInit, HostListener, EventEmitter, Output, OnDestroy } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component'
import { Router, CanActivate } from '@angular/router';
import { Globals } from 'src/app/globals';
import { SharedService } from '../../../_services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { BaseService } from '../../base/base.service';


//demo

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnDestroy, OnInit {

  menuItems: any[];
  subMenuItems: any[] = [];
  sidebarNav: any[];

  width: any;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('window:resize', ['$event'])
  sizeWindow(event) {
    this.width = event.target.innerWidth;
    //console.log('width =>', this.width);
  }

  // image: any;
  subscription: Subscription;
  subscriptionForFirstName: Subscription

  constructor(private router: Router,
    private sidebarService: SidebarService,
    private adminLayoutComponent: AdminLayoutComponent,
    private sharedService: SharedService,
    private baseService: BaseService,
    private cookieService: CookieService,
    public globalVars: Globals,
    public appComponent: AppComponent) {
      this.subscription = this.baseService.getProfileImage().subscribe(imageUrl => { 
        this.initialImg = imageUrl.imageUrl; 
        console.log("the subscription")
      });
      this.subscriptionForFirstName = this.baseService.getFirstName().subscribe(first_name => { this.userAccount.first_name = first_name.first_name; });

  }

  ngOnInit() {
    this.getSubmenu();
    // this.linkGmail();
    this.linkBox();
    this.getAccountSettings();
    // var x = this.globalVars.expand;
    // if (this.globalVars.subsVar == undefined) {
    //   this.globalVars.subsVar = this.globalVars.
    //     invokeFirstComponentFunction.subscribe(() => {
    //       this.isShowSidenav = false
    //     });
    // }
    // this.getUserSetting();
  }

  callListItem: any = [];
  length: any = '';

  //   },err =>{
  //     console.log(err);
  //     return false;
  //   })
  // }

  // alldoner: any[];
  // allDoner(){
  //   this.authService.allDoner().subscribe(doner=>{
  //     this.alldoner = doner['msg'];
  //     console.log(this.alldoner)
  //   },err =>{
  //     console.log(err);
  //     return false;
  //   })
  // }
  getSubmenu() {

    this.sidebarService.getAccount().subscribe(
      (data: any) => {
        if (data.Error === 505) {
          this.userLogout();
        } else {

          this.subMenuItems = data.account.navigation;
          // console.log(this.subMenuItems)
        }
      },
      (error) => {
        this.globalVars.show_notification = true
        this.globalVars.errorMessage = error

        setTimeout(() => {
          this.globalVars.show_notification = false;
          // console.log("try: " + this.globalVars.show_notification)
        }, 4000);
      }
    )

    console.log(116, "get sidebar called")
    this.sidebarService.getSidebar().subscribe(
      (data: any) => {
        console.log(119, 'sidebar data returned', data);
        if (data.Error === 505) {
          this.userLogout();
        } else {
          // console.log(data)

          
          this.menuItems = data.sidebar.navigation; //this.demomenuItems;

          var currentUser = JSON.parse(localStorage.getItem('userInfo'));

          var userSkills = currentUser.skills;
          
          setTimeout( () => { 
          //console.log(125, userSkills, this.menuItems)
          if(userSkills.indexOf("link-building-communication") != -1)
          {
            this.subMenuItems.push(
              {path: "link-building-communication", title: "Outreach", icon: "receipt", collapse: "autobot"},
              {path: "email-received", title: "Respond", icon: "receipt", collapse: "autobot"},
              {path: "haro", title: "Haro", icon: "receipt", collapse: "autobot"}
            )
          }

          //console.log(137, userSkills);
          
          if(userSkills.indexOf("admin") != -1){
            //console.log(140, "here")

            this.subMenuItems.push(
              { path: "search_bounties", title: "Bounties", icon: "receipt", collapse: "autobot" }
            ); 

            this.subMenuItems.push(
              { path: "in_progress", title: "In Progress", icon: "receipt", collapse: "autobot" }
            ),

            this.subMenuItems.push(
              { path: "checkin", title: "Check In", icon: "receipt", collapse: "autobot" }
            ),

            this.subMenuItems.push(
              { path: "inhouse", title: "In House", icon: "receipt", collapse: "autobot" }
            ) 

            this.subMenuItems.push(
              { path: "completed", title: "Completed", icon: "receipt", collapse: "autobot" }
            ) 
           
             //alert("getSidebar Returned" + JSON.stringify(this.subMenuItems)); 
          }

          }, 500)
          //console.log(164, this.subMenuItems);
          
          
          // if(userSkills.indexOf("inhouse") != -1)
          // {
          //   this.menuItems.push(
          //     { path: "inhouse", title: "In-House", icon: "receipt", collapse: "autobot" }
          //   )
          // }

          // if(userSkills.indexOf("checkin") != -1)
          // {
          //   this.menuItems.push(
          //     { path: "checkin", title: "Check In", icon: "receipt", collapse: "autobot" }
          //   )
          // }

          // if(userSkills.indexOf("devices") != -1)
          // {
          //   this.subMenuItems.push(
          //     { path: "devices", title: "Devices", icon: "receipt", collapse: "autobot" }
          //   )
          // }

          // if(currentUser.dashboard == 'authority_dashboard'){
          //   this.subMenuItems.push(
          //     { path: "search_bounties", title: "Bounties", icon: "receipt", collapse: "autobot" }
          //   ); 
          //   this.subMenuItems.push(
          //     { path: "in_progress", title: "In Progress", icon: "receipt", collapse: "autobot" }
          //   ) 
          //   this.subMenuItems.push(
          //     { path: "completed", title: "Completed", icon: "receipt", collapse: "autobot" }
          //   ) 
          // }

          // console.log(this.menuItems)
        }
      },
      (error) => {
        this.globalVars.show_notification = true
        this.globalVars.errorMessage = error

        setTimeout(() => {
          this.globalVars.show_notification = false;
          // console.log("try: " + this.globalVars.show_notification)
        }, 4000);
      }
    )
  }

  // isMobile = false
  // isMobileMenu() {
  //   if ($(window).width() > 991) {
  //     return false;
  //     // this.isMobile = false;
  //     // console.log("BORO")
  //   }
  //   // this.isMobile = true;
  //   // console.log("CHUto")
  //   return true;
  // }
  // isMobileMenu() {
  //   if ($(window).width() > 991) {
  //     return false;
  //   }
  //   return true;
  // };

  // mobiletest = false
  // mobile_test() {
  //   // console.log($(window).width())
  //   if (this.width > 991) {
  //     this.mobiletest = true;
  //     console.log("Salma")
  //     return;
  //   }
  //   if (this.width < 991) {
  //     this.mobiletest = false;
  //     console.log("Kona")
  //     return;
  //   }
  // }

  closeBtn: any = false;
  openBtn: any = true
  openNav() {
    // console.log("click openNav")
    this.closeBtn = true
    this.openBtn = false;
  }

  closeNav() {
    // console.log("click closeNav")
    this.openBtn = true
    this.closeBtn = false
  }

  // show_hide = false;
  // test() {
  //   this.show_hide = !this.show_hide;
  //   console.log("Thi sis sidebar")
  // }

  linkedIn_profile: any = ''
  linkedIn_profile_error: any = '';
  settingAvailable: any = false;
  initialImg: string = '';
  first_name: string = '';
  getAccountSettings() {
    this.sidebarService.getAccountSettings().subscribe(
      (data: any) => {
        if (data.Error === 505) {
          this.url = '';
          this.length = '';
          this.url = '';
          this.length = '';
          this.userLogout();
        } else {
          if (data.settings.settings.profile_img_link) {
            this.initialImg = data.settings.settings.profile_img_link;
          } else {
            this.initialImg = '../../../../assets/img/faces/blank_profile.png';
          }
          this.first_name = data.settings.settings.first_name;
          if (data.settings.settings) {
            this.settingAvailable = true;
            this.userAccount = data.settings.settings
            if (data.settings.settings.first_name) {
              this.globalVars.loggedInUsername = data.settings.settings.first_name
            }
            if (data.settings.settings.email) {
              this.globalVars.loggedInUserEmail = data.settings.settings.email
            }
          }
        }
      }, (error) => {
        // console.log(JSON.stringify(error));
      }
    )
  }

  url: any = ''

  click() {
    window.location.href = this.url;
  }

  gmail_url: any = ''
  box_url: any = ''

  bSpecialAccount: boolean = false;
  
  userLogout() {
    this.url = '';
    this.length = '';
    this.initialImg = '';
    this.globalVars.loggedInUserEmail = ''
    this.globalVars.loggedInUsername = ''
    this.appComponent.isUserloggedIn = false
    this.globalVars.global_success = false;
    this.globalVars.global_loader = false;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('sessionData');
    this.cookieService.delete('Authorization');
    this.router.navigate(['login']);
  }

  linkGmail() {
    var userEmail = sessionStorage.getItem('email');
    this.sidebarService.linkGmail(userEmail).subscribe((data: any) => {
      if (data.Error === 505) {
        console.log("Nai")
        this.userLogout();
      } else {
        this.gmail_url = data.integrations.authURL;
      }

    },
      (error) => {
        console.log(JSON.stringify(error));
      }
    )
  }

  linkBox() {
    var userEmail = sessionStorage.getItem('email');
    this.sidebarService.linkBox(userEmail).subscribe((data: any) => {
      if (data.Error === 505) {
        console.log(353, "Nai")
        this.userLogout();
      } else {
        console.log(271, data.redirect_uri)
        this.box_url = data.redirect_uri
      }

    },
      (error) => {
        console.log(JSON.stringify(error));
      }
    )
  }

  gmail_click() {
    window.location.href = this.url;
  }

  ngOnDestroy(): void {
    this.url;
    this.length;
    this.initialImg;
    this.subscription.unsubscribe();
  }

  accountMenuItems: any = []
  getAccount() {
    this.sidebarService.getAccount().subscribe(
      (data: any) => {
        this.accountMenuItems = data.account.navigation;
        // console.log(data);
      },
      (error) => {
        this.globalVars.show_notification = true
        this.globalVars.errorMessage = error

        setTimeout(() => {
          this.globalVars.show_notification = false;
          // console.log("try: " + this.globalVars.show_notification)
        }, 4000);
      });
  }

  showSubMenuDropdown: any;
  public isShowSidenav: any = this.globalVars.expand;
  isShowHideUser: any = true;
  showsubNav: any = false;
  nav_show_hide: any = false;

  showSubMenu(menuItem) {
    this.showSubMenuDropdown = menuItem.collapse;
    this.showsubNav = true;
    // console.log("showSubMenu");
    this.nav_show_hide = !this.nav_show_hide;
  }

  onClickCollaps() {
    this.isShowSidenav = !this.isShowSidenav;
    //alert( 'Hello ' + '\nWelcome to C# Corner \nFunction in First Component');
  }

  click_coutside_dv = false
  click_coutside_mdv = false
  onClickUserShow() {
    this.click_coutside_dv = !this.click_coutside_dv;
    this.click_coutside_mdv = !this.click_coutside_mdv;
  }
  onClickedOutsideDV(e: Event) {
    this.click_coutside_dv = false;
  }

  onClickedOutsideMDV(e: Event) {
    this.click_coutside_mdv = false;
    // console.log(e);
    // console.log("Click outside Mobile is working")
  }



  // someFunc(add: any) {
  //   const result = add(5, add);
  //   console.log('and result is', result);
  // }

  //WRITE BY IMRAN

  userAccount: any
  getUserSetting() {
    this.sidebarService.getUserSettings().subscribe(
      (data: any) => {
        // this.userAccount = data.settings.settings;
        // console.log(data);
        // console.log(362, this.userAccount);
      }, (error) => {
        this.globalVars.show_notification = true
        this.globalVars.errorMessage = error
      });
  }


}
