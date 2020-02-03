import { Directive, Input } from '@angular/core';
import { AsyncValidatorFn, AsyncValidator, NG_ASYNC_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, timer, of } from "rxjs";
import { map, tap, switchMap, debounceTime, catchError } from 'rxjs//operators';

import { RegisterService } from '@partie/register/services/register.service';
import { BaseResponse } from '@partie/register/models/user.model';


export function duplicateValueValidator(registerService: RegisterService, fieldName: string): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const delayTime = 500; //milliseconds
    console.log('Value received for checking:', control.value);

    return timer(delayTime).pipe(switchMap(() =>
      isDuplicate(registerService, control.value, fieldName)

        .pipe(map((resp: BaseResponse) => {
          console.log('Response', resp);
          return (resp.hasError) ? { "duplicateValue": true } : null;
        }), catchError(err => handleError(err))
        )));
  };
}


function handleError(err: any): Observable<any> {
  console.log('Error', err);
  return err.status === 500 ? of({ "serverError": true }) : of({ "pattern": true });
}


@Directive({
  selector: '[duplicateValue][formControlName],[duplicateValue][formControl],[duplicateValue][ngModel]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: DuplicateValueValidatorDirective, multi: true }]
})
export class DuplicateValueValidatorDirective implements AsyncValidator {
  constructor(private registerService: RegisterService) { }
  @Input('duplicateValue')
  inputData: string;

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return duplicateValueValidator(this.registerService, this.inputData)(control);
  }
}


function isDuplicate(registerService: RegisterService, value: string, fieldName: string): Observable<BaseResponse> {

  switch (fieldName.toLowerCase()) {
    case 'username':
      return registerService.validateUsername(value);
    case 'email':
      return registerService.validateEmail(value);
    case 'phone':
          return registerService.validatePhoneNumber(value);
    case 'displayname':
      return registerService.validateDisplayName(value);
  }
}
