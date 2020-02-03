import { Injectable } from '@angular/core';
import { SubscribeStatusEnum } from '@partie/modules/subscription/Models/Subscription.model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private subscriptionStatus = SubscribeStatusEnum;

  combineUrl(basePath: string, appendPath: string): string {

    let char = basePath.substring(basePath.length - 1, basePath.length);
    if (char === '/') {
      basePath = basePath.substr(0, appendPath.length - 1);
    }

    char = appendPath.substring(0, 1);
    if (char === '/') {
      appendPath = appendPath.substr(1, appendPath.length - 1);
    }

    return `${basePath}/${appendPath}`;
  }

  isEmpty(obj: any) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
  }

  isUserSubscribedOnce(status: SubscribeStatusEnum): boolean {
    var isUserSubscribedOnce = status && (status !== this.subscriptionStatus.NOT_SUBSCRIBED && status !== this.subscriptionStatus.APPROVAL_PENDING && status !== this.subscriptionStatus.CANCELLED);
    return isUserSubscribedOnce;
  }
}
