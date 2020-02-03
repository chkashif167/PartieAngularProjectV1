import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


import { RoomService } from '@partie/room/services/room.service';
import { CurrentUserService, ICurrentUser } from '@partie/core/services/current-user.service';
import { SignalRService } from '@partie/core/services/signalr.service';

import { JoinRoomResponse } from '@partie/room/models/room.model';

@Injectable({
  providedIn: 'root'
})
export class AcceptInvitationGuard implements CanActivate {


  constructor(private readonly router: Router,
    private readonly roomService: RoomService,
    private readonly currentUserService: CurrentUserService,
    private readonly signalRService: SignalRService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    const roomId = route.paramMap.get('roomId');

    this.currentUserService.afterCurrentUserChanged
      .subscribe(cu => {

        const currentUser = cu as ICurrentUser;

        this.roomService.acceptInvitation(roomId).subscribe(resp => {
            if (resp.accepted) {

                this.roomService.joinRoom(roomId)
                    .subscribe((joinRoomResponse: JoinRoomResponse) => {

                        if (joinRoomResponse.newlyJoined || joinRoomResponse.rejoined) {

                            this.signalRService.sendToServer('joinRoom', roomId, currentUser.id, currentUser.displayName);
                            this.redirectToChatRoom(roomId);
                        }
                    });
            }
            else
                this.redirectToChatRoom(roomId);
           
        });
      });

    return true;
  }

  private redirectToChatRoom(roomId: string): void {
    this.router.navigate([`partie/${roomId}/chat`]);
  }

}
