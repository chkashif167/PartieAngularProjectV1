import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { ReportUser } from '@partie/modules/profile/models/report-user.model';

@Component({
  selector: 'partie-report-dialog',
  templateUrl: './report-dialog.component.html'
})
export class ReportDialogComponent implements OnInit {

    model: ReportUser;
    title: string;
    subHeading: string;
    submitted:boolean;

    constructor(public dialog: DialogRef) {
      this.submitted = false;
    }

    ngOnInit() {
      this.subHeading = 'Please include relevent details on the abusive contents';
    }

  onSubmit(report: string) {

    if (!report || !report.trim()) {
      this.submitted = true;
      return;
    }

      this.model.comments = report;
        this.onClose();
  }
  onClose() {
     this.dialog.close(this.model);
  }

}
