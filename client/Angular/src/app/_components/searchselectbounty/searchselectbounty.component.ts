import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-searchselectbounty',
  templateUrl: './searchselectbounty.component.html',
  styleUrls: ['./searchselectbounty.component.css']
})
export class SearchselectbountyComponent implements OnInit {

@ViewChild('myDateRange') input: ElementRef;

checkoutForm = this.formBuilder.group({
    name: '',
    address: '',
    dates: '',
  });

  constructor(private formBuilder: UntypedFormBuilder) { }

  //@Output() datesSelected = new EventEmitter<string>();

@Output() datesSelected = new EventEmitter<string>();
	

  	options = {
  		autoApply:true,
  		clickOutsideAllowed:true
  	}

	addNewItem(value: string) {
	   // this.newItemEvent.emit(value);
	}

	ngOnInit(): void {
	  	
	}

  	@Output() newItemEvent = new EventEmitter<object>();

	onSubmit(): void {

		var fromDate = this.input["fromDate"];		// is A Moment()
		var toDate = this.input["toDate"];			// is also a Moment

		toDate.add(23, 'hours');
		toDate.add(59, 'minutes');
		toDate.add(59, 'seconds');

		// This ensures we cover the entire selected range.

	    //console.log(39, fromDate.format(), toDate.format());
	    //console.log(this.input["range"])

	    this.newItemEvent.emit({ "fromDate": fromDate.format(), "toDate":toDate.format() });
	    
	}

	ngAfterViewInit() {
	    setTimeout(function () {
	        document.getElementById("dateRangePicker-0").click();
	        document.getElementById("dateRangePicker-0").focus();
	    }, 50);
	}

	filter(){

	}

}
