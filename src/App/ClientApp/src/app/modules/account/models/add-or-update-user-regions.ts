
export class AddOrUpdateUserRegionsRequest {

  userId: string;
  regionIds: string[];
}

export class AddOrUpdateUserRegionsResponse {

  userRegionsChanged: boolean;
}

