import { Component, OnInit, ElementRef } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { BaseService } from '../base/base.service'
import { SharedService } from '../../_services/shared.service'
import { Location } from '@angular/common'
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-email-research',
  templateUrl: './email-research.component.html',
  styleUrls: ['./email-research.component.css']
})
export class EmailResearchComponent extends BaseComponent implements OnInit {

  constructor(
    public service: BaseService, 
    public elementRef: ElementRef,
    public sharedService: SharedService, 
    private location: Location, 
    private formBuilder: UntypedFormBuilder){
  	super(service, elementRef)
  }


  ngOnInit(): void {
    this.getEmailResearch()
  }

  // For get all data
  aggregateStr = `[
    {"$lookup":{
        "from":"keywords",
        "localField":"bounty_id",
        "foreignField":"linkcampaign_id",
        "as":"keyword"
    }},
    {"$unwind":"$keyword"},
    { "$match": { "strategy" :"sniper",
      "emails.outbound": { "$exists": true, "$size": 0 },
      "emails.inbound": { "$exists": true, "$size": 0 },
      "selected": false
    } },
    { $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT", "$keyword" ] } } },
    { $project: { "keyword": 0 } }
    ]`

  getEmailResearch(){
    this.service.getInitialDataTableList("outreach_emails", 1, '', '', '', '', this.aggregateStr).subscribe((data: any) => {
      // the data we have will come here
      console.log(data)
    })
  }

  // For Update Missing Data
  domain:string;
  email:string;
  first:string;
  last:string;
  blog_page:string;
  affiliate_site:string;
  ecommerce:string;
  affiliate_program:string;
  dr:string;
  parent_topic:string;
  suggestions:string;
  social:string;
  notes:string;

  addEmailResearchForm = new UntypedFormGroup({
    domain: new UntypedFormControl('',[Validators.required]),
    email: new UntypedFormControl('',[Validators.required]),
    first: new UntypedFormControl('',[Validators.required]),
    last: new UntypedFormControl('',[Validators.required]),
    blog_page: new UntypedFormControl('',[Validators.required]),
    affiliate_site: new UntypedFormControl('',[Validators.required]),
    ecommerce: new UntypedFormControl('',[Validators.required]),
    affiliate_program: new UntypedFormControl('',[Validators.required]),
    dr: new UntypedFormControl('',[Validators.required]),
    parent_topic: new UntypedFormControl('',[Validators.required]),
    suggestions: new UntypedFormControl('',[Validators.required]),
    social: new UntypedFormControl('',[Validators.required]),
    notes: new UntypedFormControl('',[Validators.required])
  });
  get adddomain(){return this.addEmailResearchForm.get('domain')};
  get addemail(){return this.addEmailResearchForm.get('email')};
  get addfirst(){return this.addEmailResearchForm.get('first')};
  get addlast(){return this.addEmailResearchForm.get('last')};
  get addblogpage(){return this.addEmailResearchForm.get('blog_page')};
  get addaffiliatesite(){return this.addEmailResearchForm.get('affiliate_site')};
  get addecommerce(){return this.addEmailResearchForm.get('ecommerce')};
  get addaffiliateprogram(){return this.addEmailResearchForm.get('affiliate_program')};
  get adddr(){return this.addEmailResearchForm.get('dr')};
  get addparenttopic(){return this.addEmailResearchForm.get('parent_topic')};
  get addsuggestions(){return this.addEmailResearchForm.get('suggestions')};
  get addsocial(){return this.addEmailResearchForm.get('social')};
  get addnotes(){return this.addEmailResearchForm.get('notes')};

  addEmailResearch(){
    let body = {
      ... this.addEmailResearchForm.value
    }
    console.log(body)
    console.log(this.addEmailResearchForm.value.domain)
  }



}
