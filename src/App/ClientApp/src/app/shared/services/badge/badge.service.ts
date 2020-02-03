
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SharedModule } from '@partie/shared/shared.module';
import { ApiBaseService } from '@partie/shared/services/api-base.service';
import { Badge, UserBadge } from '@partie/modules/room/models/rate-host/rate-host.model';



@Injectable({
  providedIn: SharedModule

})
export class BadgeService extends ApiBaseService {
  getBadges(): Observable<Badge[]> {
    return this.get<Badge[]>(null, '/badges');

  }

  getUserBadgeStats(userId:string): Observable<UserBadge[]> {
    return this.get<UserBadge[]>(null, `/badges/stats/${userId}`);
  }
}
