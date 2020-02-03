import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, } from 'rxjs//operators';
import { Subject } from 'rxjs';

import { AuthService } from '@partie/core/services/auth.service';

@Component({
  selector: '',
  template: ''
})
export class CallbackComponent implements OnInit, OnDestroy {

  //Private fields
  private teardown$ = new Subject<void>();

  constructor(private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  ngOnInit(): void {
    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {

      this.router.navigateByUrl('/');
      return;
    }

    this.authService.completeAuthentication().then((resp) => {});

    //this.authService.afterUserManagerInitialized
    //  .pipe(takeUntil(this.teardown$))
    //  .subscribe(resp => {
       
       // this.authService.completeAuthentication().then((resp) => { });
     // });
   
  }

  ngOnDestroy(): void {

    this.teardown$.next();
    this.teardown$.complete();
  }
}
