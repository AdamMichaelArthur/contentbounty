import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router,
  CanActivate
} from '@angular/router';
import {
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import {
  SheduleService
} from './shedule-service';


@Component({
  selector: 'app-qualifications',
  templateUrl: './shedule.component.html',
  styleUrls: ['./shedule.component.css']
})
export class SheduleInterviewComponent implements OnInit {

  constructor(public router: Router, private service: SheduleService) {}

  ngOnInit() {


  }


  user_email_format_error = false
  user_email = '';
  user_email_error = false
  ValidateEmail() {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.user_email.match(mailformat)) {
      this.user_email_error = false
      this.user_email_format_error = false
      // return true;
    } else {
      this.user_email_error = false
      this.user_email_format_error = true
      // return false;
    }

    if (this.user_email == '') {
      this.user_email_error = true
      this.user_email_format_error = false

    }
  }

  skype_address: any = '';
  today: any = '';
  time = '';
  date_error = false
  time_error = false
  skype_address_error = false


  ValidateDate() {
    if (this.today == '') {
      this.date_error = true
    }
    if (this.today != '') {
      this.date_error = false
    }

  }
  ValidateTime() {
    if (this.time == '') {
      this.time_error = true
    }
    if (this.time != '') {
      this.time_error = false
    }

  }

  ValidateskypeAddress() {
    if (this.skype_address == '') {
      this.skype_address_error = true
    }
    if (this.skype_address != '') {
      this.skype_address_error = false
    }
  }

  addEvent1(type: string, event: MatDatepickerInputEvent < Date > ) {
    this.today = event.value
  }

  emailsent = false
  submitInfo() {
    console.log(this.user_email);
    console.log(this.skype_address);
    console.log(this.today);
    console.log(this.time);

    if (this.user_email === '') {
      this.user_email_error = true
    }
    if (this.skype_address === '') {
      this.skype_address_error = true
    }

    if (this.today === '') {
      this.date_error = true
    }

    if (this.time === '') {
      this.time_error = true
    }

    if (this.user_email != '' && this.skype_address != '' && this.today != '' && this.time != '') {
      this.user_email_error = false;
      this.skype_address_error = false;
      this.time_error = false;
      this.date_error = false;

      var body = {
        emailTo: "gugly2009@gail.com",
        type: 'interviewsheduleEmail',
        subject: this.user_email,
        msg: this.today + this.time
  
      }
  
      console.log(body);
      this.service.emailShedule(body).subscribe(
        (data: any) => {
          console.log(data);
          this.emailsent = true
        })

    }



  }


}
