import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';



import { PartnerProgress } from "@partie/account/models/partner-progress";
import { AccountService } from "@partie/account/services/account.service";


@Component({
  selector: "partie-partner-progress",
  templateUrl: "./partner-progress.component.html",
  styleUrls: ["./partner-progress.component.css"]
})
export class PartnerProgressComponent implements OnInit {
  achievements: PartnerProgress[];
  progressPrcent: number;
  isExpanded: boolean;
  status: boolean = false;

  private teardown$ = new Subject<void>();


  @ViewChild("progressBar") progressBar: ElementRef;

  constructor(private accountService: AccountService) {
    this.progressPrcent = 0;
    this.achievements = new Array<PartnerProgress>();
  }

  ngOnInit() {
    this.accountService.getPartnerProgress()
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: PartnerProgress[]) => {
        if(resp.length > 0){
         this.achievements = resp;
        this.calculateAchievements();
      }
      });
  }


  calculateAchievements() {

    //set initial achievement to empty to
    //overcome issue when accomplished > target
    const  initialValue = {
      id: "",
      title: "",
      achievementId: "",
      description: "",
      target: 0,
      accomplished: 0
    } as PartnerProgress;

    const calculated = this.achievements.reduce((a, b, i) => {
        return {
        id: "",
        title: "",
        achievementId: "",
        description: "",
        target: a.target + b.target,
        accomplished: a.accomplished + (b.accomplished > b.target ? b.target : b.accomplished)
      };
    },initialValue);

    this.progressPrcent = Math.trunc(
      (calculated.accomplished / calculated.target) * 100
    );
    this.progressBar.nativeElement.style.setProperty(
      "--progress-bar-percent", `${this.progressPrcent}%`
    );
  }
  toggleExpandedClass() {
    this.isExpanded = !this.isExpanded;
  }
}
