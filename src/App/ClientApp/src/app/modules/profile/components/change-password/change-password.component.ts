import { Component, OnInit } from '@angular/core';
//Services
import { RegularExpConstants } from '@partie/core/constants/regexp.constants';
import { ProfileService } from '@partie/modules/profile/services/profile.service';
import { ChangePassword } from '../../models/change-password';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { Router } from '@angular/router';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';

declare var require: any;
let calculatePasswordStrength = require('zxcvbn');

@Component({
  selector: 'partie-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordRegex = RegularExpConstants.passwordRegex;
  model: ChangePassword;

  constructor(private readonly profileService: ProfileService, private readonly toasterService: PartieToastrService,
    private readonly router: Router,
    private readonly currentUserService: CurrentUserService) {

  }

  ngOnInit() {
    this.model = new ChangePassword();
  }

  passwordStrengthCalculator() {

    const password = document.querySelector("input[name='newPassword']");
    const meter = document.querySelector(".password-meter");

    const val = (password as HTMLInputElement).value;
    const result = calculatePasswordStrength(val);

    if (val === '') {
      meter.setAttribute("data-password-strength", '');
    } else {
      meter.setAttribute("data-password-strength", result.score.toString());
    }
  }

  onSubmit() {

    this.profileService.changePassword(this.model)
      .subscribe((res: any) => {
        if (res.result) {
          this.toasterService.success("Password has successfully changed.");
         this.currentUserService.afterCurrentUserChanged
            .subscribe((u: ICurrentUser) => {
              this.router.navigateByUrl(`/profile/${u.id}`);

            });
        } else {
          this.toasterService.warning("Old password is incorrect.");
        }
      });
  }

}
