import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FriendshipCounters, FollowUserResponse } from '@partie/profile/models/fiendship.model';
import { MutedUsersResponse, MutedUser } from '@partie/profile/models/followers.model';
import { GetFollowRequestResponse } from '@partie/shared/models/friends-list/friend.model'

import { ApiBaseService } from '@partie/shared/services/api-base.service';


@Injectable({
  providedIn: 'root'
})
export class FriendshipService extends ApiBaseService {

  getCounters(userId: string): Observable<FriendshipCounters> {
    return this.get<FriendshipCounters>(null, `/friendship/${userId}/counters`);
  }

  followUser(followedUserId: string): Observable<FollowUserResponse> {
      return this.post<any, FollowUserResponse>({ followedUserId: followedUserId }, '/friendship/follow');
  }

  unFollowUser(unFollowedUserId: string): Observable<any> {
    return this.post({ unFollowedUserId: unFollowedUserId }, '/friendship/unFollow');
  }

  getFollowers(userId: string): Observable<any> {

    return this.get<any>(null, `/friendship/${userId}/followers`);
  }

  getFollowings(userId: string): Observable<any> {

    return this.get<any>(null, `/friendship/${userId}/followings`);
  }

  getMutedUsers(userId: string): Observable<MutedUsersResponse> {

    return this.get<MutedUsersResponse>(null, `/friendship/${userId}/mutedUsers`);
  }

  userMuted(userId: string, mutedUsers: MutedUser[]): boolean {
    userId = userId.toLowerCase();

    return mutedUsers.filter(mu => mu.mutedUserId.toLowerCase() === userId)[0] ? true : false;
  }

  muteUser(mutedUserId: string): Observable<any> {

    return this.post<any, any>({ mutedUserId: mutedUserId }, '/friendship/mute');
  }

  getDirectMessagingStatus(userId: string): Observable<any> {
    return this.get('', `/directmessages/status?userIds=${userId}`);
  }

   unMuteUser(unMutedUserId: string): Observable<any> {

    return this.post<any, any>({ unMutedUserId: unMutedUserId }, '/friendship/unMute');
  }

  toggleDirectMessagingStatus(): Observable<any> {
    return this.post(null, '/directmessages/toggle');
  }
  
  sendRequestToFollow(userId: string): Observable<any> {
    return this.post<any, any>({ followRequestForId: userId }, '/friendship/addFollowRequest');
  }

  getFollowRequestNotifications(pageSize = 10, pageNo = 1): Observable<GetFollowRequestResponse[]> {
    return this.get<GetFollowRequestResponse[]>(null, `/friendship/followRequests/${pageSize}/${pageNo}`);
  }

  acceptFollowRequest(followerId: string): Observable<any> {
    return this.post<any, any>({ followRequestById: followerId }, '/friendship/followRequest/accepted');
  }

  rejectFollowRequest(followerId: string): Observable<any> {
    return this.post<any, any>({ followRequestById: followerId }, '/friendship/followRequest/rejected');
  }

}
