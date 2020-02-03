import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';

@Component({
  selector: 'partie-user-feedback',
  templateUrl: './user-feedback.component.html'
})
export class UserFeedbackComponent implements OnInit{

    title: string;
    reason: string;
    submitted: boolean;

    constructor(public dialog: DialogRef) { }

    ngOnInit() {
      
    }
    onSubmit(feedback: string) {

        if (!feedback || !feedback.trim()) {
            this.submitted = true;
            return;
        }

        this.reason = feedback;
        this.onClose();
    }
    onClose() {
        this.dialog.close(this.reason);
    }

}
