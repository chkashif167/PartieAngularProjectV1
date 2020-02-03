import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'

//Services
import { ApiBaseService } from '../services/api-base.service'
//models
import { BanReason, BannedUser } from '../models/friends-list/friend.model';

@Injectable()
export class BanUsersService extends ApiBaseService {
  RoomId:string;
  banReasons:BanReason[];

  getBanUsersReasons():Observable<BanReason[]>{

    if(this.banReasons!=null)
    {
      return of(this.banReasons);
    }
     return this.get<BanReason[]>(null, '/room/GetBanReasons').pipe(map(br => {
        this.banReasons = br as BanReason[];
        return this.banReasons;
      }));
  }

  banUserFromRoom(model: BannedUser): Observable<BannedUser> {
    return this.post<any, BannedUser>(model, '/room/BanUserFromRoom');
  }
}
