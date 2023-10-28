import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.css']
})
export class QualificationsComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService,
  ) {

  }

  ngOnInit() {
  }

  redirectToShedule() {
    console.log("next step")
    this.router.navigate(['shedule_interview']);
  }

}
