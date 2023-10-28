import { Pipe } from '@angular/core';

@Pipe({
    name: 'short'
})
export class ShortPipe {
  transform(val, args) {
    if (args === undefined) {
      return val;
    }

    console.log(val);

    if (val===undefined) {
      console.log("+undefined+");
      return val;
    }else{
      if (val.length > args) {
        console.log("No undefined");
        return val.substring(0, args) + '..';
      } else {
        return val;
      }
    }
  }
}