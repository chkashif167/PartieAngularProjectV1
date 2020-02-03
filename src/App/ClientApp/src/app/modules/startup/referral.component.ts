import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//Services
import { LocalStorageService, StorageKeys } from '@partie/core/services/local-storage.service';

@Component({
  selector: 'partie-referral',
  template: '',
  
})
export class ReferralComponent implements OnInit {

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService) { }

  ngOnInit() {

    const code = this.route.snapshot.params.id;
    if (code) { this.localStorageService.setItem(StorageKeys.refCode, code, false) }
    this.router.navigateByUrl("/");
  }

}
