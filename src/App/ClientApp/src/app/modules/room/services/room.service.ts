import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { ApiBaseService } from '@partie/shared/services/api-base.service';

import { RateRoom } from '@partie/room/models/rate-host/rate-host.model';
import { ChatMessageResponse, ChatMessageRequest } from '@partie/room/models/chat-message.model';
import {
    CreateRoomRequest,
    CreateRoomResponse,
    SearchRoomResponse,
    SearchRoomRequest,
    GetRoomUsersResponse,
    GetRoomResponse,
    ValidateRoomUserResponse,
    RoomEndedResponse,
    GetJoinRoomRequestStatusResponse,
    JoiningReuqestType,
    GetJoinRoomRequestsResponse,
    GetInvitationStatusResponse,
    AddInvitationResponse,
    AddInvitationRequest,
    EditRoom,
    JoinRoom,
    UserRoomInformation,
    UserRoomStats,
    TotalUserRoomStats
} from '../models/room.model';


@Injectable({
    providedIn: 'root'
})
export class RoomService extends ApiBaseService {




    addRoom(model: CreateRoomRequest): Observable<CreateRoomResponse> {

        return this.post<CreateRoomRequest, CreateRoomResponse>(model, '/room');
    }

    editRoom(model: EditRoom): Observable<EditRoom> {
        return this.post(model, '/room/edit');
    }

    getRoom(roomId: string): Observable<GetRoomResponse> {

        return this.get<GetRoomResponse>(roomId, '/room');
    }

    joinRoom(roomId: string): Observable<any> {

        return this.post<any, any>({ roomId: roomId }, '/room/join');
    }

    getRoomChat(roomId: string, pageNumber = 1, pageSize = 100): Observable<ChatMessageResponse[]> {

        return this.get<ChatMessageResponse[]>(null, `/room/${roomId}/chat/${pageNumber}/${pageSize}`);
    }

    addChatMessage(message: ChatMessageRequest): Observable<any> {

        return this.post<ChatMessageRequest, any>(message, '/room/chat');
    }

    searchRooms(request: SearchRoomRequest): Observable<SearchRoomResponse[]> {

        return this.post<SearchRoomRequest, SearchRoomResponse[]>(request, '/room/search');
    }

    getRoomUsers(roomId: string): Observable<GetRoomUsersResponse[]> {

        return this.get<GetRoomUsersResponse[]>(null, `/room/${roomId}/users`);
    }

    rateRoom(model: RateRoom): Observable<RateRoom> {
        return this.post<any, any>(model, '/room/rate');
    }

    ValidateRoomUser(roomId: string): Observable<ValidateRoomUserResponse> {
        return this.get<ValidateRoomUserResponse>(null, `/room/${roomId}/user/exists`);
    }

    endRoom(roomId: string): Observable<RoomEndedResponse> {

        return this.post<any, RoomEndedResponse>({ roomId: roomId }, '/room/end');
    }

    leaveRoom(roomId: string): Observable<any> {
        return this.post<any, any>({ roomId: roomId }, '/room/leave');
    }

    getJoinRoomRequestStatus(roomId: string): Observable<GetJoinRoomRequestStatusResponse> {
        return this.get<GetJoinRoomRequestStatusResponse>(null, `/room/${roomId}/requestToJoin/status`);
    }

    getInvitationStatus(roomId: string): Observable<GetInvitationStatusResponse[]> {
        return this.get<GetInvitationStatusResponse[]>(null, `/room/${roomId}/invitation/status`);
    }

    getRoomUserStatus(roomId: string): Observable<any> {

        return this.get<any>(null, `/room/${roomId}/user/status`);
    }

    getJoiningRequestType(isFollower: boolean, room: JoinRoom, joinRequestStatus: GetJoinRoomRequestStatusResponse): JoiningReuqestType {

        if (room.roomPrivate) {

            if (isFollower) {
                return JoiningReuqestType.JoinRoom;
            }
            return JoiningReuqestType.DoNothing;
        }

        if (isFollower) {
            return JoiningReuqestType.JoinRoom;
        }

        if (!joinRequestStatus.exists) {
            return JoiningReuqestType.SendRequestToRoom;
        }

        if (joinRequestStatus.approvedByHost) {
            return JoiningReuqestType.JoinRoom;
        }

        if (joinRequestStatus.expired) {
            return JoiningReuqestType.SendRequestToRoom;
        };

        return JoiningReuqestType.DoNothing;
    }

    joinRoomRequest(roomId: string): Observable<any> {

        return this.post<any, any>({ roomId: roomId }, '/room/requestToJoin');
    }

    currentUserIsRoomHost(roomHostId: string, currentUserId: string): boolean {
        return roomHostId === currentUserId;
    }

    getJoinRoomRequests(roomId: string, pageNumber = 1, pageSize = 100): Observable<GetJoinRoomRequestsResponse[]> {

        return this.get<GetJoinRoomRequestsResponse[]>(null, `/room/${roomId}/requestsToJoin/${pageNumber}/${pageSize}`);
    }

    inviteUser(model: AddInvitationRequest): Observable<AddInvitationResponse> {
        return this.post<AddInvitationRequest, AddInvitationResponse>(model, '/room/invite');
    }

    acceptInvitation(roomId: string): Observable<any> {
        return this.post<any, any>({ roomId: roomId }, '/room/invitation/accept');
    }

    acceptJoiningRequest(joinRoomRequestId: string, roomId: string): Observable<any> {
        return this.post<any, any>({ joinRoomRequestId: joinRoomRequestId, roomId: roomId }, '/room/requestToJoin/accept');
    }

    commenceRoom(roomId: string): Observable<any> {

        return this.post<any, any>({ roomId: roomId }, '/room/commenceRoom');
    }
    getRoomUrl(roomId: string): string {

        return `${this.configurationService.applicationUrl}/partie/${roomId}/chat`;
    }

    getUserRoomsInformation(userId: string): Observable<UserRoomInformation[]> {
     return this.get<UserRoomInformation[]>(null, `/room/getUserRooms/${userId}`);
    }

    getUserPartieStatsWeekwise(userId: string, startDate: string, endDate: string): Observable<UserRoomStats> {
        return this.get<UserRoomStats>(null, `/room/getUserPartieStatsWeekwise/${userId}/?startDate=${startDate}&endDate=${endDate}`);
    }

    getUserPartieStats(userId: string): Observable<TotalUserRoomStats> {
      return this.get<TotalUserRoomStats>(null, `/room/getUserPartieStats/${userId}`);
    }

    getUserLevel(userId: string): Observable<any> {

        return this.get<any>(null, `/room/getUserLevel/${userId}`);
    }

}
