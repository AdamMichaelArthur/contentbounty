import { Directive } from '@angular/core';  
import { Validator, NG_VALIDATORS, ValidatorFn, UntypedFormControl } from '@angular/forms';  
  
@Directive({  
  selector: '[appBudgetRegvalidator]',  
  providers: [  
    {  
      provide: NG_VALIDATORS,  
      useClass: CustomBudgetRegValidator,  
      multi: true  
    }  
  ]  
})  
export class CustomBudgetRegValidator implements Validator {  
  
  validator: ValidatorFn;  
  constructor() {  
    this.validator = this.regValidator();  
  }  
  
  validate(c: UntypedFormControl) {  
    return this.validator(c);  
  }
  
  budgetReg = '^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)*$';
  
  regValidator(): ValidatorFn {  
    return (control: UntypedFormControl) => {  
      if (control.value != null && control.value !== '') {  
        // let isValid = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(control.value);  
        let isValid = String(control.value).match(this.budgetReg)
        if (isValid) {  
          return null;  
        } else {  
          return {  
            budgetRegValidator: { valid: false }  
          };  
        }  
      } else {  
        return null;  
      }  
    };  
  }  
}  