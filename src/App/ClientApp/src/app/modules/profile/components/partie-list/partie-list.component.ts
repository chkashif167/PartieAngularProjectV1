import { Component, OnInit } from '@angular/core';

//Modles
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { UserRoomInformation } from '@partie/modules/room/models/room.model';

@Component({
  selector: 'partie-partie-list',
  templateUrl: './partie-list.component.html',
  styleUrls: ['./partie-list.component.css']
})
export class PartieListComponent implements OnInit {

  partieList : UserRoomInformation[];
  partieCount: number;

    private teardown$;


  constructor(private readonly dialog: DialogRef) { }

    ngOnInit() {

        this.partieCount = this.partieList.length;
  }

  onBackButtonClose(evt: MouseEvent) {
    this.dialog.close();
  }

  onDialogStop(evt: MouseEvent) {
    evt.stopPropagation();
  }

}
