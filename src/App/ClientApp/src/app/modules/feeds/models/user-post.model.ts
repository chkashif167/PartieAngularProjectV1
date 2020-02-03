export class UserPostRequest {
  constructor() {
    this.private = false;
      this.file = null;
      this.description = "";
  }
  description: string;
  private: boolean;
  file: File;
}

export class PostFile {

  name: string;
  mimeType: string;
}

export class SearchUserPostRequest {
  userId: string;
  keyword: string;
  pageNumber = 1;
  pageSize = 100;
}

export class SearchUserPostResponse {

  constructor() {
      this.file = new PostFile();
      this.muted = false;
      this.following = true;
  }

  id: string;
  description: string;
  private: boolean;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  liked: boolean;
  muted: boolean;
  following: boolean;
  file: PostFile;
}

export class LikeUserPostRequest {

  postId: string;
}

export class LikeUserPostResponse {

  likes: number;
}

export class UnlikeUserPostRequest {

  postId: string;
}

export class UnlikeUserPostResponse {

    likes: number;
}

export class UserStatus {
  userId: string;
  muted: boolean;
  following:boolean;
}




