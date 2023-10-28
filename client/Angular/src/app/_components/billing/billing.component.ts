
import { Component, OnInit, ElementRef } from '@angular/core';
import { BillingService } from "./billing.service";
import { BaseService } from "../base/base.service";
import { BaseComponent } from "../base/base.component";
import { Router } from '@angular/router';
import { SnackbarComponent } from '../snackbar/snackbar.component'
import { environment } from '../../../environments/environment';
import {
  FormBuilder, FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  NgForm,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

declare const loadStripe: any;

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})

export class BillingComponent extends BaseComponent implements OnInit {
  submitted = false
  loadingStripe = true
  loadedStripe = false
  loadingPaymentMethods = true
  loadedPaymentMethods = false

  constructor(public baseservice: BaseService, public elementRef: ElementRef, public service: BillingService) {
    super(baseservice, elementRef)
    this.lottieConfigChecked = {
      path: '../../../assets/lottie/check_mark.json',
      autoplay: true,
      loop: false
    };
    this.lottieConfigError = {
      path: '../../../assets/lottie/error.json',
      autoplay: true,
      loop: false
    }
  }

  client_secret: any;
  payment_methods: any;
  plans: any;
  subscriptions: any;
  numSubscriptions: number = 0;
  isLoadingAddPayment:boolean = false;
  isLoadingAddPaymentArea:boolean = false;
  isLoadingAddPaymentSuccess:boolean = false;
  elements: any;
  stripe: any;

  showLoadingPayment(){
    this.isLoadingAddPaymentArea = true;
    this.isLoadingAddPayment = true;
  }

  async paymentComplete(results, self) {
    console.log(21, "Payment Method Added");
    self.getPaymentMethods()
  }

  ngOnInit() {
    console.log(40, "Loading Stripe", this.paymentComplete)
    
    console.log(54, this.baseservice.baseUrl)
    loadStripe(this.client_secret, this.paymentComplete, this, this.baseservice.baseUrl)
    // this.getPaymentMethods().then(() => {
    //   setTimeout(() => {
    //     this.loadingStripe = false
    //     this.loadedStripe = true
    //     this.loadingPaymentMethods = false
    //     this.loadedPaymentMethods = true
    //   }, 1000);
    // })
    // this.getPlans()
    // this.getSubscriptions()
    // this.consoleText();
		this.selectedIndex = 0;
		this.transform = 0;
  }

  paymentMethodAdded(cardInfo){
    //console.log(79, cardInfo)

    this.baseservice.addPaymentMethod(cardInfo).subscribe(
      (data: any) => {
        if(data.Error == 0){
          this.getPaymentMethods();
        } else {
          console.log(86, data)
          this.stripeDidReportError(data.ErrorDetails.Description)
        }
      });
  }

  /* Stripe Callbacks */
  stripeDidFinishEnteringCardInfo(event){
    //console.log(80, "Stripe Is Ready To Add A Payment Method", event)
    

  }

  cardError:boolean = false
  stripeDidReportError(event){
    console.log(84, "stripeDidReportError", event)
    var cardElement = this.elements.getElement('card');
    cardElement.clear()
    // alert(event)
    cardElement.focus()
    //this.isCardElement = false
    setTimeout(()=>{
      this.isLoadingAddPayment = false;
      this.isLoadingAddPaymentSuccess = false
      this.cardError = true;
    },500)
  }

  stripeIsReady(){
    console.log("Stripe is ready...")
  }

  stripeFinishedLoading(stripe, elements){
    this.stripe = stripe;
    this.elements = elements;
    console.log(65, "stripeFinishedLoading")
        this.getPaymentMethods().then(() => {
      setTimeout(() => {
        this.loadingStripe = false
        this.loadedStripe = true
        this.loadingPaymentMethods = false
        this.loadedPaymentMethods = true
      }, 1000);
    })
    this.getPlans()
    this.getSubscriptions()
    this.consoleText();
  }

  isLoadingRemoveOp:boolean[]=[];
  isLoadingRemove:boolean[]=[]
  removePaymentMethodeSuccess:boolean[]=[]
  removePaymentMethodeError:boolean[]=[]
  deletePaymentMethod(id) {
    this.isLoadingRemoveOp[id]=true;
    setTimeout(()=>{
      this.isLoadingRemove[id] = true
    },300)
    this.service.deletePaymentMethod(id).subscribe(
      (data: any) => {
        this.getPaymentMethods();
        this.isLoadingRemove[id]=false;
        this.removePaymentMethodeSuccess[id]=true
        this.openSnackBar("Payment Method Deleted Successfully!", "snackbar-class-success")
      },
      (error) => {
        setTimeout(()=>{
          this.isLoadingRemove[id]=false;
        },1000)
        setTimeout(()=>{
          this.removePaymentMethodeError[id]=true
        },1500)
        this.errorFound = true
        this.errorMessage = error
        this.openSnackBar("Payment Method Delete Failed!", "snackbar-class-warning")
      })
  }

  isLoadingSetDefaultOp:boolean[]=[];
  isLoadingSetDefault:boolean[]=[];
  setAsDefaultPaymentMethodeSuccess:boolean[]=[]
  setAsDefaultPaymentMethodeError:boolean[]=[]
  defaultPaymentMethod(id) {

    console.log(100, "view Id: " + id)

    this.isLoadingSetDefaultOp[id]=true;
    setTimeout(()=>{
      this.isLoadingSetDefault[id]=true;
    },500)

    this.service.defaultPaymentMethod(id).subscribe(
      (data: any) => {
        this.getPaymentMethods();
        this.isLoadingSetDefault[id]=false;
        this.setAsDefaultPaymentMethodeSuccess[id]=true
        setTimeout(()=>{
          this.setAsDefaultPaymentMethodeSuccess[id]=false;
          this.isLoadingSetDefaultOp[id]=false;
        },3000)
        this.openSnackBar("Default Payment Method Updated!", "snackbar-class-success")
      },
      (error) => {
        setTimeout(()=>{
          this.isLoadingSetDefault[id]=false;
        },1000)
        setTimeout(()=>{
          this.setAsDefaultPaymentMethodeError[id]=true
        },1500)
        this.errorFound = true
        this.errorMessage = error
        this.openSnackBar("Default Payment Method Update Failed!", "snackbar-class-warning")
      })
  }

  async getPaymentMethods() {
    console.log(48, "getPaymentMethods Called");
    this.service.getPaymentMethods().subscribe(
      (data: any) => {
        this.payment_methods = data.stripe.methods;
        console.log(29, this.payment_methods);
        this.isLoadingAddPayment = false;
        this.isLoadingAddPaymentSuccess = true;
        setTimeout(()=>{
          this.isCardElement = false;
          this.isLoadingAddPaymentArea = false
        },500)
        setTimeout(()=>{
          this.isCardElementShow = false;
        },800)
      },
      (error) => {
        this.errorFound = true
        this.errorMessage = error
      })
  }

  getPaymentIntent() {
    this.service.getPaymentIntent().subscribe(
      (data: any) => {
        this.client_secret = data.client_secret;
        console.log(29, this.client_secret)
        loadStripe(this.client_secret)
      },
      (error) => {
        this.errorFound = true
        this.errorMessage = error
      })
  }


  cancelSubscription(id, planId) {
    this.planId = planId;
    this.isLoadingConfirmPlan[planId] = true;
    this.service.cancelSubscription(id).subscribe(
      (data: any) => {
        this.subscriptions = data.stripe.subscriptions;
        this.numSubscriptions = 0
        this.openSnackBar("Subscription Cancelled!", "snackbar-class-warning")
        this.isLoadingConfirmPlan[planId] = false;
        this.isConfirmPlanPopUp[planId] = false;
      },
      (error) => {
        this.errorFound = true
        this.errorMessage = error
        this.openSnackBar(error.Description + "!", "snackbar-class-danger")
      })
  }

  planId:number;
  async getSubscriptions() {
    console.log("==============")
    console.log(this.planId)
    this.service.getSubscriptions().subscribe(
      (data: any) => {
        this.subscriptions = data.stripe.subscriptions;
        this.numSubscriptions = data.stripe.subscriptions.length;
        console.log(91, `You have ${this.numSubscriptions} subscriptions`);
        if(this.planId !== undefined){
          this.isLoadingConfirmPlan[this.planId] = false;
          // this.isConfirmPlanPopUp[this.planId] = false;
          this.isConfirmPlanPopUpSuccess[this.planId] = true;
        }
      },
      (error) => {
        if(this.planId !== undefined){
          this.isConfirmPlanPopUpFailure[this.planId] = true;
        }
        this.errorFound = true
        this.errorMessage = error
      })
  }

  async getPlans() {
    this.service.getPlans().subscribe(
      (data: any) => {
        this.plans = data.stripe.plans;
      },
      (error) => {
        this.errorFound = true
        this.errorMessage = error
      })
  }

  message ={}
  setOrUpdateSubscription(planId) {
    console.log(102, this.baseservice.baseUrl, planId);
    this.planId = planId;
    this.isLoadingConfirmPlan[planId] = true;
    if (this.numSubscriptions == 0) {
      // Create a subscription
      this.service.createSubscription(planId).subscribe(
        (data: any) => {
          // alert("Subscription Created")
          this.openSnackBar("Subscription Created!", "snackbar-class-success")
          // this.isConfirmPlanPopUp[planId] = false;
          this.isConfirmPlanPopUpSuccess[planId] = true;
          return this.getSubscriptions();
        },
        (error) => {
          this.isConfirmPlanPopUpFailure[planId] = true;
          this.errorFound = true
          this.errorMessage = error
          this.message = JSON.parse(this.errorMessage.toString()).error.ErrorDetails.Description
          console.log(this.message) 
          this.openSnackBar("Subscription Creation Failed!", "snackbar-class-warning")
        })
    }
    else {
      // Update Existing Subscription
      console.log(118, this.subscriptions[0].id, planId)
      this.service.updateSubscription(this.subscriptions[0].id, planId).subscribe(
        (data: any) => {
          // alert("Subscription Updated")
          this.openSnackBar("Subscription Updated!", "snackbar-class-success")
          return this.getSubscriptions();
        },
        (error) => {
          this.errorFound = true
          this.errorMessage = error.Description
          console.log(this.errorMessage)
          this.openSnackBar("Subscription Update Failed!", "snackbar-class-warning")
        })
    }
  }


  isCardElement:boolean = false;
  isCardElementShow:boolean = false;
  showCardElement(){
    var cardElement = this.elements.getElement('card');
    if(!this.isCardElement){
      cardElement.clear()
    }

    this.isCardElementShow = !this.isCardElementShow;
    setTimeout(()=>{
      this.isCardElement = !this.isCardElement;
    },500)

    this.isLoadingAddPayment = false;
    this.isLoadingAddPaymentSuccess = false;
    
    cardElement.focus()
    setTimeout( () => {
      cardElement.focus()     
    }, 500, cardElement)
  }


	// Slider
	public selectedIndex: number;
	public transform: number;
	selected(x) {
		this.slideLeftRight(x);
		this.selectedIndex = x;
	}
	pageinnationSelected(x) {
		this.slideLeftRight(x);
		this.selectedIndex = x;
	}
	slideLeftRight(i) {
		this.transform = 0 - (i) * 100;
		this.selectedIndex = this.selectedIndex + 1;
		if (this.selectedIndex > this.plans.length) {
			this.selectedIndex = 0;
		}
	}
	next() {
		if (this.selectedIndex <= this.plans.length - 1) {
			this.selected(this.selectedIndex += 1)
		}
		if (this.selectedIndex == this.plans.length) {
			this.selected(this.selectedIndex -= this.plans.length)
		}
	}
	previous() {
		if (this.selectedIndex > 0) {
			this.selected(this.selectedIndex -= 1)
		}
	}

  // Confirm plan popup
  isConfirmPlanPopUp:boolean[] = [];
  isLoadingConfirmPlan:boolean[] = [];
  isConfirmPlanPopUpSuccess:boolean[] = [];
  isConfirmPlanPopUpFailure:boolean[] = [];
  confirmPlanPopup(id:any){
    this.isConfirmPlanPopUp[id] = true
  }
  confirmPlanPopupHide(id:any){
    this.isConfirmPlanPopUp[id] = false;
    this.isConfirmPlanPopUpSuccess[id] = false;
    this.isConfirmPlanPopUpFailure[id] = false;
  }


  // Loader Animations
  options: AnimationOptions = {
    path: '../../../assets/lottie/data.json',
  };
  loading_spinner: AnimationOptions = {
    path: '../../../assets/lottie/loading_spinner.json',
  };

  public lottieConfigChecked: Object;
  public lottieConfigError: Object;

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  


}
// error.ErrorDetails.Description

// { "headers":{"normalizedNames":{},"lazyUpdate":null},
//   "status":500,
//   "statusText":"Internal Server Error",
//   "url":"http://localhost:3000/api/stripe/subscription",
//   "ok":false,
//   "name":"HttpErrorResponse",
//   "message":"Http failure response for http://localhost:3000/api/stripe/subscription: 500 Internal Server Error",
//   "error":{"Result":"Failure",
//           "ErrorDetails":{"Error":33000,"Description":"This customer has no attached payment source or default payment method."},"error":33000}}