import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UiUpdatesManagerService {

    updateRealtimeUiChanges(payload: any): void {
        if (!payload || !payload.type) return;

        switch (payload.type) {
            case "PostLiked":
            case "PostUnLiked":
                this._postLikeChanged.next({
                    postId: payload.additionalData.postId,
                    likesCount: payload.additionalData.likesCount
                });
                break;
            case "UserFollowed":
                this._userFollowChanged.next({
                    followedUserId: payload.additionalData.followRequestForId
                });
                break;
            case "PartieNameUpdated":
                this._partieNameUpdated.next({
                    roomId: payload.additionalData.roomId,
                    name: payload.additionalData.name,
                    description: payload.additionalData.description
                });
            case "UserUnFollowed":
                this._userUnFollowChanged.next({
                    unFollowedUserId: payload.additionalData.unFollowedUserId
                });
                break;
            case "DirectMessageDeleted":
                this._directMessageDeleted.next({
                    messageId: payload.additionalData.messageId,
                    senderId: payload.additionalData.senderId,
                    receiverId: payload.additionalData.receiverId,
                    deletedById: payload.additionalData.deletedById
                });
                break;
            case "NotificationRead":
                this._notificationRead.next({
                   notificationIds: payload.additionalData.notificationIds,
                   notificationFor: payload.additionalData.userId
                });
                break;

            default:

        }
    }

    private readonly _postLikeChanged = new ReplaySubject<any>(1);
    postLikeChanged = this._postLikeChanged.asObservable();

    private readonly _userFollowChanged = new ReplaySubject<any>(1);
    userFollowChanged = this._userFollowChanged.asObservable();

    private readonly _partieNameUpdated = new ReplaySubject<any>(1);
    partieNameUpdated = this._partieNameUpdated.asObservable();

    private readonly _userUnFollowChanged = new ReplaySubject<any>(1);
    userUnFollowChanged = this._userUnFollowChanged.asObservable();

    private readonly _directMessageDeleted = new ReplaySubject<any>(1);
    directMessageDeleted = this._directMessageDeleted.asObservable();

    private readonly _notificationRead = new ReplaySubject<any>(1);
    notificationRead = this._notificationRead.asObservable();

}
