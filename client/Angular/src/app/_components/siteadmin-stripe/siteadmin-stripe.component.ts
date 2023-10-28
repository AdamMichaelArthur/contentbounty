import { Component, OnInit } from '@angular/core';
import { SiteadminStripeService } from './siteadmin-stripe-service';
import {Router} from '@angular/router';
declare const loadStripe: any;

@Component({
  selector: 'app-siteadmin-stripe',
  templateUrl: './siteadmin-stripe.component.html',
  styleUrls: ['./siteadmin-stripe.component.css']
})

export class SiteadminStripeComponent implements OnInit {

  client_secret: any;

  constructor(private service: SiteadminStripeService, private router: Router) { 

  }

  paymentComplete(){
    console.log(21, "Payment Method Added")
    alert("Payment Method Added")
  }

  ngOnInit() {
    loadStripe(this.client_secret, this.paymentComplete);
    this.getPlansList();
    this.getProductList();
  }

  getPaymentIntent(){
  	  this.service.getPaymentIntent().subscribe((data:any) =>{
      	this.client_secret = data.client_secret;
      	console.log(29, this.client_secret)
      	loadStripe(this.client_secret)
      })
  }

  //Plan
  isLoading = true;
  isEmptyPlan = false;
  plan_list:any;
  getPlansList(){
  	  this.service.getPlansList().subscribe((data:any) =>{
      	this.plan_list = data.stripe.plans;
      	console.log(this.plan_list);
        this.isLoading = false;
      });
      if(this.plan_list === null || this.plan_list === ''){
        this.isEmptyPlan = true
      }else{
        this.isEmptyPlan = false
      }
  }

  addPlanPopup = false;
  addPleanePopup(){
    this.addPlanPopup = true;
  }
  hideAddPlanePopup(){
    this.addPlanPopup = false;
  }

  id: string;
  amount: number;
  productId: string;
  users: number;
  emails: number;
  bounties: number;

  addPleane(){
    const addPlan = {
      id: this.id,
      amount: this.amount,
      productId: this.productId,
      metadata:{
        users: this.users,
        emails: this.emails,
        bounties: this.bounties
      }
    }
    console.log(addPlan);
    this.service.addPlan(addPlan).subscribe((data:any)=>{
      console.log(data);
      this.getPlansList();
      this.addPlanPopup = false;
    },error=>{
      console.log("Plan Added Faile!")
    })
  }

  updatePlanPopup = false;
  update_plan:any;
  updatePlan(plan:any){
    this.update_plan = plan;
    this.updatePlanPopup = true;
  }
  hideUpdatePlanePopup(){
    this.updatePlanPopup = false;
  }

  deletePlan(plan:any){
    const index: number = this.plan_list.indexOf(plan);
    if(index !== -1){
        this.plan_list.splice(index, 1)
    }
    this.service.deletePlansList(plan.id).subscribe((data:any)=>{
      console.log(data)
    },error=>{
      console.log(error);
      return false;
    })
  }
  

  //Product
  product_list:any;
  isEmptyProduct = false;
  getProductList(){
  	  this.service.getProductList().subscribe((data:any) =>{
      	this.product_list = data.stripe.data;
      	console.log(this.product_list);
        this.isLoading = false;
      });
      if(this.product_list === null || this.product_list === ''){
        this.isEmptyProduct = true;
      }else{
        this.isEmptyProduct = false;
      }
  }

  add_product_popup = false;
  addProductPopup(){
    this.add_product_popup = true;
  }
  hideAddProductPopup(){
    this.add_product_popup = false;
  }
  productName:string
  addProduct(){
    const addProduct = {
      productName: this.productName
    }
    if (addProduct) {
      this.product_list.push(addProduct)
    }
    this.service.addProduct(addProduct).subscribe((data:any)=>{
      console.log(data);
      this.add_product_popup = false;
      this.getProductList()
    },error=>{
      console.log("Product Add Faile!")
    })
  }
  deleteProduct(product:any){
    const index: number = this.product_list.indexOf(product);
    if(index !== -1){
        this.product_list.splice(index, 1)
    }
    this.service.deleteProduct(product.id).subscribe((data:any)=>{
      console.log(data)
    },error=>{
      console.log(error);
      return false;
    })
  }

  
  // End UI Controle
  viewMode = 'plan';
  

}
