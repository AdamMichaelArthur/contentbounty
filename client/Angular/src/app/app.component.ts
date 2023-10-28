import { Component } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SharedService } from './_services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUserloggedIn = false;
  isExpanded = true;
  currentUser: any = '';
  constructor(private router: Router,private cookieService: CookieService,public globalVars: Globals ) {
    const cookieExists: boolean = cookieService.check('Authorization');
   // console.log("cookieExists in main app component:" + cookieExists)
    
    //console.log(cookieService.getAll())
   
    // BY cookies value 
    if (cookieExists) {
      //console.log('Login done');
      this.isUserloggedIn = true;
      if (this.isUserloggedIn === true) {
        if(this.globalVars.global_success){
          console.log("try sucess :this.globalVars.global_success ")
          this.router.navigate(['success']);
        }else{
          if( this.globalVars.welcome === true){
            this.router.navigate(['welcome']);
          }else{
          this.globalVars.global_loader = true;
          console.log("try Loader from app: " + this.globalVars.global_loader)
          console.log("try sucess :this.globalVars.global_success ")
          this.router.navigate(['welcome']);
        }
        }
    
      }
    }
    if (!cookieExists) {
      //console.log('not LOgin done');
      this.isUserloggedIn = false;
      //this.router.navigate(['login']);
      //console.log(cookieExists);
  }


  }
  ngOnInit() {

  }

}
