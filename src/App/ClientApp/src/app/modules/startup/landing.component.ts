import { Component, OnInit } from '@angular/core';
import { User } from 'oidc-client';
import { Router } from '@angular/router';

import { AuthService } from '@partie/core/services/auth.service';
import { ConfigurationService } from '@partie/shared/services/configuration.service';


@Component({
  selector: 'partie-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  user: User;

  constructor(private readonly authService: AuthService,
    private readonly router: Router,
    private readonly config: ConfigurationService) { }

  ngOnInit() {

  }

  login(): void {
    this.authService.startAuthentication();
  }

  loginWithFacebook() {

    this.authService.initialize(this.config.getFacebookAuthSettings);
    this.authService.startAuthentication();
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

}
