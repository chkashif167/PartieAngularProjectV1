import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AccountService } from '@partie/modules/account/services/account.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';



@Component({
  selector: 'partie-earning-tracker',
  templateUrl: './earning-tracker.component.html',
  styleUrls: ['./earning-tracker.component.css']
})
export class EarningTrackerComponent implements OnInit {
    @Input() userId: string;
    earnedAmount: string;

    constructor(private readonly accountService: AccountService) { }

    ngOnInit() {
         console.log("USERID:", this.userId);
           var subscription = this.accountService.getUserEarnedAmount(this.userId)
              .subscribe((result: any) => {
                  this.earnedAmount = result.amount;
                  subscription.unsubscribe();
            });
       
      
    }
   

}
