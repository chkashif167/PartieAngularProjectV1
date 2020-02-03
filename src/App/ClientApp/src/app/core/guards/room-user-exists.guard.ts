import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

//Models
import { ValidateRoomUserResponse } from '@partie/room/models/room.model';

//Services
import { RoomService } from '@partie/room/services/room.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service'


@Injectable({
  providedIn: 'root'
})
export class RoomUserExistsGuard implements CanActivate {

  constructor(private readonly roomService: RoomService, private readonly toasterService: PartieToastrService,
    private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const roomId = route.paramMap.get('roomId');
    let allowed: boolean = true;
    let msg: string = '';
    return this.roomService.ValidateRoomUser(roomId).pipe(map((resp: ValidateRoomUserResponse) => {

      if (resp.partieEnded) {

        msg = "Partie has been ended.";
        allowed = false;
      }
      else if (resp.isBanned) {

        msg = "You are banned by the host.";
        allowed = false;
      }
      else if (resp.hasLeft) {

        msg = "Please rejoin partie.";
        allowed = false;

      } else if (!resp.hasJoined) {

        msg = "Please join party.";
        allowed = false;
      }

      if (!allowed) {
        this.toasterService.error(msg);
        this.router.navigate(['partie']);
      }

      return allowed;
    }));
  }
}
