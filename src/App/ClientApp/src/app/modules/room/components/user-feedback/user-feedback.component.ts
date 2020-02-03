import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { RateRoom } from '@partie/room/models/rate-host/rate-host.model';

@Component({
  selector: 'partie-user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.css']
})
export class UserFeedbackComponent implements OnInit{

    model: RateRoom;
    title: string;
    constructor(public dialog: DialogRef) { }

    ngOnInit() {
      
    }
    onSubmit(feedback: string) {
        this.model.feedback = feedback;
        this.onClose();
    }
    onClose() {
        this.dialog.close(this.model);
    }

}
