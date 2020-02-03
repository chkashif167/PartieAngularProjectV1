import { AbstractControl, ValidatorFn, NG_VALIDATORS, Validator, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Directive, Attribute } from '@angular/core';



@Directive({
  selector: '[validateEqual][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EqualValidator, multi: true }
  ]
})
export class EqualValidator implements Validator {

  validator: ValidatorFn;

  constructor(@Attribute('validateEqual') public validateEqual: string,
    @Attribute('minLengthToCompare') public minLengthToCompare: string) {

    this.validator = this.validateEqualFactory();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  // validation function
  validateEqualFactory(): ValidatorFn {
    return (c: AbstractControl) => {

      const ageObj = {
        valid: true,
        validateEqual: true
      };

      const inputControlValue = c.value;

      if (this.isUndefineNullOrEmpty(inputControlValue)) {
        return null;
      }

      if (inputControlValue.length < Number(this.minLengthToCompare)) {
        return null;
      }

      const matchingControl = c.root.get([this.validateEqual]);

      if (inputControlValue && matchingControl && matchingControl.value !== inputControlValue) {
        ageObj.valid = false;
        ageObj.validateEqual = false;
      }

      // value equal
      if (inputControlValue && matchingControl && matchingControl.value === inputControlValue) {


        if (matchingControl.errors) {
          delete matchingControl.errors['validateEqual'];
          delete matchingControl.errors['valid'];
          if (!Object.keys(matchingControl.errors).length) matchingControl.setErrors(null);
        }
       
        ageObj.valid = true;
        ageObj.validateEqual = true;
      }

      // value not equal
      if (matchingControl && inputControlValue !== matchingControl.value) {
        const errors = matchingControl.errors || { validateEqual: false } as ValidationErrors;
        matchingControl.setErrors(errors);
        ageObj.valid = false;
        ageObj.validateEqual = false;
      }

      if (ageObj.valid) {
        return null;
      }

      return ageObj;
    }
  }

  private isUndefineNullOrEmpty(value: string): boolean {

    if (!value) {
      return true;
    }
    return false;
  }
}
