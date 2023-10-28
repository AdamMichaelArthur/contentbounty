import { Component, OnInit } from '@angular/core';
import { SubmitBountyService } from './submit-bounty.service';

@Component({
  selector: 'app-submit-bounty',
  templateUrl: './submit-bounty.component.html',
  styleUrls: ['./submit-bounty.component.css']
})
export class SubmitBountyComponent implements OnInit {

  constructor( public submitBountyService:SubmitBountyService ) { }
  dummy_bounty_submits:any = []
  //isNewBounty = true;
  ngOnInit() {
    this.getAuthoritysInfo();
    // if(this.dummy_bounty_submits.length != null){
    //   this.isNewBounty = false;
    //   alert("false")
    // }else{
    //   this.isNewBounty = true;
    //   alert("true")
    // }
    this.dummy_bounty_submits = [
      {
        message:"Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero’s De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:",
        link:"https://xd.adobe.com/view/17fd049c-ef93-435d-7208-ef6b27ac13c3-61cc/"
      }
    ]
  }

  message:string;
  link:string;

  sendBounty() {
    const test = {
      message: this.message,
      link: this.link
    }
    if(test){
      this.dummy_bounty_submits.push(test);
    }
    this.message = null;
    this.link = null;
    localStorage.setItem('cart', "[]")
  }

  authorityInfo:any = [];
  getAuthoritysInfo(){
    this.submitBountyService.getAuthoritysInfo().subscribe((data:any)=>{
      this.authorityInfo = data.creatorsbounty;
      console.log(this.authorityInfo);
    },error=>{
      console.log(error)
    })
  }

}
