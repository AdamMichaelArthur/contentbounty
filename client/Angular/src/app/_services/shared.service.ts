import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  isUserloggedIn = false;
  public gugly = true;
  private baseUrl = environment.apiBase;

  _id
  _dateKey
  _dateValue
  _variableData: any
  date
  weeklyView
  monthlyView
  routingToBountyDetail = false
  referringPage
  xbody
  constructor() { }

  drop(event: CdkDragDrop<string[]>) {
    console.log(30, "drop");
    if (event.previousContainer === event.container) {
      console.log(32, "Move item in array")
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //console.log(30, event.previousIndex, event.container.data);
      event.container.data.splice(event.currentIndex, 1, event.previousContainer.data[event.previousIndex])
      event.previousContainer.data.splice(event.previousIndex, 1);
      // take an action in the backend, and return the result...
      // //console.log(30, event.currentIndex, event.previousContainer.data)
      //   transferArrayItem(event.previousContainer.data,
      //       event.container.data,
      //       event.previousIndex,
      //       event.currentIndex);
    }
  }

  refreshData() {

  }
}
