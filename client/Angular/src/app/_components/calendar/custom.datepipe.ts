import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Pipe({
    name: 'customDate'
})
export class CustomDatePipe extends
    DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        var start = moment(value).startOf('month').toDate()
        var startOfMonth = super.transform(start, "d MMMM")
        var end = moment(value).endOf('month').toDate()
        var endOfMonth = super.transform(end, "d MMMM")
        var valueTransfer = super.transform(value, "d MMMM");
        if (
            endOfMonth === valueTransfer
        ) {
            // console.log("trying check 1")
            return super.transform(value, "d MMMM");
        }
        else if (
            startOfMonth === valueTransfer
        ) {
            // console.log("trying check")
            return super.transform(value, "d MMMM");
        }
        else {
            return super.transform(value, "d");
        }
    }
}