import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

import { RoomService } from '@partie/modules/room/services/room.service';
import { GetJoinRoomRequestsResponse } from '@partie/modules/room/models/room.model';
import { FileService } from '@partie/core/services/file.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';

import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';

@Component({
  selector: 'partie-join-room-request-list',
  templateUrl: './join-room-request-list.component.html',
  styleUrls: ['./join-room-request-list.component.css']
})
export class JoinRoomRequestListComponent implements OnInit {

  title: string;
  roomId: string;
  model: GetJoinRoomRequestsResponse[];

  //Private fields
  private teardown$ = new Subject<void>();

  constructor(
    private readonly dialog: DialogRef,
    private readonly roomService: RoomService,
    private readonly fileService: FileService,
    private readonly tostrService: PartieToastrService) {

    this.model = [];
  }

  ngOnInit() {

    this.bindJoinRoomRequests();
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

  onBackButtonClick(evt: MouseEvent) {
    this.dialog.close();
  }

  onDialogClick(evt: MouseEvent) {
    evt.stopPropagation();
  }

  acceptJoiningRequest(model: GetJoinRoomRequestsResponse): void {

    this.roomService.acceptJoiningRequest(model.joinRoomRequestId, model.roomId)
      .pipe(takeUntil(this.teardown$))
      .subscribe(resp => {

        this.tostrService.success('Request accepted successfully');
        this.bindJoinRoomRequests();
        //this.onBackButtonClick(null);
      });

  }

  private bindJoinRoomRequests(): void {

    this.roomService.getJoinRoomRequests(this.roomId, 1, 100)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: GetJoinRoomRequestsResponse[]) => {

        this.model = resp.map(item => {
          let listItem = new GetJoinRoomRequestsResponse();
          listItem = item;
          listItem.requestedByAvatar = this.fileService.getProfileAvatarUrl(listItem.requestedById);
          return listItem;
        });
      });
  }
}
