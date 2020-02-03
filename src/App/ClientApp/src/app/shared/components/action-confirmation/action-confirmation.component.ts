import { Component, OnInit } from '@angular/core';

import { ActionConfirmation } from '@partie/shared/models/action-confirmation/action-confirmation.model';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';

@Component({
  selector: 'partie-action-confirmation',
  templateUrl: './action-confirmation.component.html',
  styleUrls: ['./action-confirmation.component.css']
})
export class ActionConfirmationComponent implements OnInit {

  model: ActionConfirmation;
  private selectedAction: boolean;

  constructor(private readonly dialog: DialogRef) {
  }

  ngOnInit() {

    this.model.modelClass = `modal ${this.model.modelClass} dynamic-height active`;
  }

  confirm(action: boolean): void {
    this.selectedAction = action;
    this.onBackButtonClick(null);
  }

  onBackButtonClick(evt: MouseEvent) {
    this.dialog.close(this.selectedAction);
  }

  onDialogClick(evt: MouseEvent) {
    evt.stopPropagation();
  }

}
