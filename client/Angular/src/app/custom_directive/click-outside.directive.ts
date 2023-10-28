// import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

// @Directive({
//   selector: '[clickOutside]'
// })
// export class ClickOutsideDirective {
  
//   constructor(private _elementRef: ElementRef) { }

//   @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter();

  
//   @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement) {
//     const clickedInside = this._elementRef.nativeElement.contains(targetElement);
//     if (!clickedInside) {
//       this.clickOutside.emit(null);
//     }
//   }

// }

import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

}