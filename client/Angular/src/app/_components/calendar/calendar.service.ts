import {
	ComponentFactoryResolver,
	Injectable,
	Inject,
	ReflectiveInjector
} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs'
import { map, take, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CalendarItemComponent } from './calendar-cell/calendar-item/calendar-item.component'

/*
	  Each datasource object is expected to look like this:
	  {
		  datasource: String,		// The mongoDB collection to perform a .find() on
		  _dateKey: String,		// The key in the document that contains the date value of interest
	  }

	  Example:
	  datasources = [
		  {
			  datasource: bounty,
			  _dateKey: release_for_bounty
		  },
		  {
			  datasource: users,
			  _dateKey: signup_date
		  }
	  ]

	  In this instance, we would get documents back that look like this:
	  [
		  {
			  _id: "12345"
			  datasource: bounty,
			  _dateKey: release_for_bounty,
			  _dateValue: "2020-03-26T22:06:21.013Z"
		  },
		  {
			  _id: "12345"
			  datasource: uses,
			  _dateKey: signup_date,
			  _dateValue: "2020-03-26T22:06:21.013Z"
		  }
	  ]

	  These documents would then be used to create <calendar-item> for each document
	  and the calendar component would be responsible for looping through and determining
	  where each item should be initially placed.
*/

@Injectable({
	providedIn: 'root'
})

export class CalendarService {

	constructor(@Inject(ComponentFactoryResolver) factoryResolver, public http: HttpClient,
		public cookieService: CookieService, public router: Router) {
	}

	setRootViewContainerRef(viewContainerRef) {

	}

	addDynamicComponent() {
		// const factory = this.factoryResolver
		//                     .resolveComponentFactory(DynamicComponent)
		// const component = factory
		//   .create(this.rootViewContainer.parentInjector)
		// this.rootViewContainer.insert(component.hostView)
	}

	public baseUrl = environment.apiBase
	private api_url = this.baseUrl + '/datasource/brand';
	public key = "";

	httpOptions = {
		headers: new HttpHeaders({
			'accept': 'application/json',
			'Content-Type': 'application/json'
		}),
		"withCredentials": true
	};

	datasources: Array<Object> = [];

	// We may have multiple datasources here.  For example,
	getBetweenDates(begin, end, filter =null) {
		var api_url = this.baseUrl + '/datasource/' + 'bounty' + "/dates"
		var pBody = {
			"startDate": begin,
			"endDate": end,
			"scope": "account",
			"_dateKey": "release_for_bounty",
			"filter":filter
		}
		return this.http.post(api_url, pBody, this.httpOptions).pipe(map(response => {
			return response
		}))
	}

	public handleError(error: HttpErrorResponse) {
		console.log(282, error);
	}

	updateDate(datasource: string, _id: string, _dateKey: string, _newDateValue: string) {
		console.log("Calling update calendar");
		var api_url = this.baseUrl + '/datasource/' + datasource + "/calendar"
		var pBody = {
			"_id": _id,
			"_dateValue": _newDateValue,
			"_dateKey": _dateKey,
		}
		return this.http.post(api_url, pBody, this.httpOptions).pipe(map(response => {
			return response
		}))
	}

	deleteBounty(_id) {
		var api_url = this.baseUrl + '/datasource/bounty/id/' + _id

		return this.http.delete(api_url, this.httpOptions).pipe(map(response => {
			return response
		}))
	}

}
