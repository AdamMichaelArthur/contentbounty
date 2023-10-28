import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { EmailSendService } from '../email-send/email-send.service';
import { EmailSendComponent } from '../email-send/email-send.component'
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-email-response',
  templateUrl: './email-response.component.html',
  styleUrls: ['./email-response.component.css']
})

export class EmailResponseComponent implements OnInit {

  // datasource = "messages"
  // aggregateStr = null

  @Input() public emailReceived = null

  dataModel = "test";
  emailReceivedBody = "";

  ngOnInit(): void {
  	

    this.emailReceivedBody = this.emailReceived.body[0].body;

    console.log(28, this.emailReceived.body)

    for(var i = 0; i < this.emailReceived.body.length; i++){
      var body = this.emailReceived.body[i];
      var mimeType = body.mimeType;
      
      if(mimeType == "text/html"){
        console.log(33, mimeType);
        this.emailReceivedBody = body.body;

      }
    }
  }

}