import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@partie/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private readonly authService: AuthService,
    private readonly router: Router) {

  }

  canActivate() {
   
    const userClaims = this.authService.getClaims();
    if (userClaims && userClaims.sub) {
      this.redirectToHomepage(); 
    }
    return true;
  }

  private redirectToHomepage(): void {
       this.router.navigateByUrl('/feed');
  }

}
