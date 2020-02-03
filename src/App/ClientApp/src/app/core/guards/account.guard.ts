import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '@partie/core/services/auth.service';
import { CurrentUserService } from '@partie/core/services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountGuard implements CanActivate {

  constructor(private readonly currentUserService: CurrentUserService,
    private readonly authService: AuthService,
    private readonly router: Router) {

  }

  canActivate() {

    if (this.authService.isLoggedIn()) {
      const claims = this.authService.getClaims();
      if (claims.PhoneNotVerified && claims.PhoneNotVerified === '1') {
        this.router.navigateByUrl(`/verify/phone`);
        return false;
      }
      else if (!this.currentUserService.getCachedCurrentUser) {

        
        const  userId = claims.sub;
        this.currentUserService.loadCurrentUser(userId);
      }
      return true;
    }
    else if (this.authService.isNewSocialAccountRegistering()) {

      this.router.navigateByUrl('/register');
      return false;
    }
    this.authService.startAuthentication();
    return false;

  }


}
