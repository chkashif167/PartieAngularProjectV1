import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';


import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { GetInvitationStatusResponse, AddInvitationResponse, AddInvitationRequest } from '@partie/modules/room/models/room.model';

//Services
import { RoomService } from '@partie/modules/room/services/room.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';

@Component({
  selector: 'partie-invite-to-room',
  templateUrl: './invite-to-room.component.html',
  styleUrls: ['./invite-to-room.component.css']
})
export class InviteToRoomComponent implements OnInit {

  model: GetInvitationStatusResponse[];
  roomId: string;

  //Private fields
  private teardown$ = new Subject<void>();

  constructor(private readonly dialog: DialogRef,
    private readonly roomService: RoomService,
    private readonly partieToastService: PartieToastrService) { }

  ngOnInit() {

    this.bindInvitationStatus();
  }

  private bindInvitationStatus(): void {
    this.roomService.getInvitationStatus(this.roomId)
      .pipe(takeUntil(this.teardown$))
      .subscribe(resp => {
        this.model = resp;
      });
  }

  inviteFollower(followerUserId: string): void {

    const requestModel = new AddInvitationRequest();
    requestModel.roomId = this.roomId;
    requestModel.inviteeId = followerUserId;
    this.roomService.inviteUser(requestModel).pipe(takeUntil(this.teardown$)).subscribe(
      (resp: AddInvitationResponse) => {
        
        if (resp.invited) {
          const msgTitle = resp.invited ? 'Invitation' : 'Resending the Invitation';
          this.partieToastService.success('User is invited', msgTitle);
        }

        this.bindInvitationStatus();

      });
  }

  resendInvitation(followerUserId: string): void {
    this.inviteFollower(followerUserId);
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

}
