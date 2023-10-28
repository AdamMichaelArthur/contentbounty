import { Directive } from '@angular/core';  
import { Validator, NG_VALIDATORS, ValidatorFn, UntypedFormControl } from '@angular/forms';  
  
@Directive({  
  selector: '[appWebRegvalidator]',  
  providers: [  
    {  
      provide: NG_VALIDATORS,  
      useClass: CustomWebsiteUrlRegValidator,  
      multi: true  
    }  
  ]  
})  
export class CustomWebsiteUrlRegValidator implements Validator {  
  
  validator: ValidatorFn;  
  constructor() {  
    this.validator = this.regValidator();  
  }  
  
  validate(c: UntypedFormControl) {  
    return this.validator(c);  
  }
  
  websiteUrlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  
  regValidator(): ValidatorFn {  
    return (control: UntypedFormControl) => {  
      if (control.value != null && control.value !== '') {  
        // let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(control.value);  
        let isValid = control.value.match(this.websiteUrlReg)
        if (isValid) {  
          return null;  
        } else {  
          return {  
            websiteRegValidator: { valid: false }  
          };  
        }  
      } else {  
        return null;  
      }  
    };  
  }  
}  