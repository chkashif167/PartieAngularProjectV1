import { AbstractControl, ValidatorFn, NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { Directive } from '@angular/core';

//Services
import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { RegisterService } from '@partie/register/services/register.service'


@Directive({
  selector: '[agelimit][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: AgeLimitValidator, multi: true }
  ]
})
export class AgeLimitValidator implements Validator {

  validator: ValidatorFn;
  ageLimit: number;

  constructor(private readonly registerationService: RegisterService,
    private readonly configurationService: ConfigurationService) {
    this.validator = this.validateAgeLimitFactory();
    this.ageLimit = Number(configurationService.getAgeLimit);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }


  // validation function
  validateAgeLimitFactory(): ValidatorFn {
    return (c: AbstractControl) => {

      const ageObj = {
        valid: true,
        ageLimit: null

      };

      if (this.isNotValidDob(c.value)) {
        return null;
      }

      const dob = this.registerationService.getValidDateFormat(c.value);

      if (!dob) {
        ageObj.valid = false;
        ageObj.ageLimit = `Enter proper formated date (month/year ie. 01/2000)`;
      }

      if (!this.hasValidAgeLimit(dob)) {
        ageObj.valid = false;
        ageObj.ageLimit = `Age must be at least ${this.ageLimit} years.`;
      }

      if (ageObj.valid) {
        return null;
      }

      return ageObj;
    }
  }

  private hasValidAgeLimit(dataOfBirth: string): boolean {

    let age = this.getAge(dataOfBirth);

    if (age >= this.ageLimit) {
      return true;
    }
    return false;
  }

  private isNotValidDob(dataOfBirth: string): boolean {
    //it is considered as empty dob, the empty check is already attached
    if (!dataOfBirth) {
      return true;
    }

    if (dataOfBirth.length < 6) {
      return true;
    }

    return false;
  }

  private getAge(dob: string): number {

    let today = new Date();
    let birthday = new Date(dob);
    let thisYear = 0;

    if (today.getMonth() < birthday.getMonth()) {
      thisYear = 1;
    }
    else if ((today.getMonth() === birthday.getMonth()) && today.getDate() < birthday.getDate()) {
      thisYear = 1;
    }
    let age = today.getFullYear() - birthday.getFullYear() - thisYear;
    return age;
  }

}
