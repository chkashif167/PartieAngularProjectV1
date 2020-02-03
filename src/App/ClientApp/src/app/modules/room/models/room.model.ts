export class CreateRoomRequest {

    constructor() {
        this.displayName = '';
        this.objective = '';
        this.private = false;
        this.tags = '';
        this.private = false;
        this.gameId = '';
        this.gameTypes = '';
        this.gamePlatforms = '';
        this.roleName = '';
        this.expertise = '';
        this.templateName = '';
        this.termsAndConditionsAccepted = false;
        this.addTemplate = false;
        this.addPost = false;
        this.comPreference = true;
    }
    displayName: string;
    objective: string;
    tags: string;
    private: boolean;
    gameId: string;
    gameTypes: string;
    gamePlatforms: string;
    roleName: string;
    expertise: string;
    termsAndConditionsAccepted: boolean;
    addTemplate: boolean;
    addPost: boolean;
    templateName: string;
    comPreference: boolean;
}

export class CreateRoomResponse {
    id: string;
}

export class CreateRoom {

    constructor() {
      
        this.gameId = '';
        this.gameTitle = '';
        this.gameTags = '';
    }
    gameId: string;
    gameTitle: string;
    gameTags: string;
    gameTypes: string;
    gamePlatforms: string;
    roleName: string;
    expertise: string;
  
}

export class EditRoom {

    id: string;
    displayName: string;
    description: string;
    gameId: string;
    gameTitle: string;
    tags: string;
    private: boolean;

}



export class SearchRoomResponse {

    constructor() {
        this.tagsList = [];
    }

    id: string;
    displayName: string;
    description: string;
    private: boolean;
    createdDate: string;
    partieStarted: string;
    partieEnded: string;
    partieSucceeded: boolean;
    tags: string;
    tagsList: string[];
    gameId: string;
    gameTitle: string;
    hostName: string;
    hostId: string;
    alreadyJoined: boolean;
    myCommencedPartie: boolean;
    inviteesCount: number;
    participantsCount: number;
    elapsedDuration: string;
    weightage: number;
}

export class SearchRoomRequest {
    keyword: string;
    pageNumber = 1;
    pageSize = 100;
    templateId: string;
}

export class GetRoomUsersResponse {
    userId: string;
    displayName: string;
    host: boolean;
}


import { Follower } from '@partie/profile/models/followers.model';
export class JoinRoom {

    constructor() {
        this.roomId = '';
        this.roomDisplayName = '';
        this.roomDescription = '';
        this.roomPrivate = false;
        this.roomCreateDate = '';
        this.roomPartieStarted = '';
        this.roomPartieEnded = '';
        this.roomPartieSucceeded = false;
        this.roomTags = [];
        this.roomGameId = '';
        this.roomGameName = '';
        this.roomHostId = '';
        this.roomHost = false;
        this.roomHostFollowersCount = '';
        this.roomHostName = '';
        this.roomHostFollowers = [];
    }
    roomId: string;
    roomDisplayName: string;
    roomDescription: string;
    roomPrivate: boolean;
    roomCreateDate: string;
    roomPartieStarted: string;
    roomPartieEnded: string;
    roomPartieSucceeded: boolean;
    roomTags: string[];
    roomGameId: string;
    roomGameName: string;
    roomHostId: string;
    roomHost: boolean;
    roomHostName: string;
    roomHostFollowersCount: string;
    roomHostFollowers: Follower[];
    joiningRequestType: JoiningReuqestType;
    joinRoomRequestStatus: GetJoinRoomRequestStatusResponse;
}

export class GetRoomResponse {
    constructor() {
        this.tagsList = [];
    }

    id: string;
    displayName: string;
    description: string;
    tags: string;
    tagsList: string[];
    gameId: string;
    gameTitle: string;
    hostName: string;
    hostId: string;
    createdDate: string;
    partieStarted: string;
    partieEnded: string;
    private: boolean;
}

export class ValidateRoomUserResponse {
    hasJoined: boolean;
    isBanned: boolean;
    hasLeft: boolean;
    partieEnded: boolean;
}

export class RoomEndedResponse {
    partieEnded: boolean;
    partieSucceeded: boolean;
}

export class JoinRoomResponse {
    newlyJoined: boolean;
    rejoined: boolean;
}

export class GetJoinRoomRequestStatusResponse {

    approvedByHost: boolean;
    exists: boolean;
    expired: boolean;
}

export enum JoiningReuqestType {

    SendRequestToRoom,
    JoinRoom,
    DoNothing,
    RoomNotCommenced
}

export class GetJoinRoomRequestsResponse {

    joinRoomRequestId: string;
    requestedById: string;
    requestedByDisplayName: string;
    roomId: string;
    roomDisplayName: string;
    requestedByAvatar: string;
}

export class GetInvitationStatusResponse {

    followerId: string;
    followerDisplayName: string;
    status: string;
    followerAvatarUrl: string;
}

export class AddInvitationRequest {
    inviteeId: string;
    roomId: string;
}

export class AddInvitationResponse {
    invited: boolean;
}

export class RoomTag {

    name: string;
    selected: boolean;
}

export class RoomUserStatus {

    static userLeft = 'UserLeft';
    static userJoined = 'UserJoined';
    static userBanned = 'UserBanned';
}
export class UserRoomInformation {
    id: string;
    displayName: string;
    description: string;
    gameName: string;
    tags: string;
}

export class UserRoomStats {
    constructor() {
        this.chartData = new Array<ChartData>();
    }
    userId: string;
    weeklyHours: string;
    weeklyTotalParties: string;
    weeklyTotalBadges: string;
    chartData: ChartData[];
}

export class ChartData {
    day: string;
    weeklyParties: number;
    weeklyBadges: number;
    weeklyTimeInParties: number;
}

export class TotalUserRoomStats {
    totalTimeInParties: string;
    totalParties: string;
    totalBadges: string;
}


