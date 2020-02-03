import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpEvent } from '@angular/common/http';


import { ApiBaseService } from '@partie/shared/services/api-base.service';


@Injectable({
  providedIn: 'root'
})
export class FileService extends ApiBaseService {

    private avatarImgCacheBustValue: number = 0;
    private avatarData: AvatarData[] = [];

  burstAvatarImgCache(): void {

    this.avatarImgCacheBustValue =  new Date().getTime();
  }

  uploadProfileAvatar(key: string, fileToUpload: File): Observable<HttpEvent<any>> {

    const formData = this.getFormData(key, fileToUpload);

    return this.postWithFile(formData, '/profile/avatar/upload');
  }

  uploadPostFile(userId: string, postId: string, key: string, fileToUpload: File): Observable<HttpEvent<any>> {

    const formData = this.getFormData(key, fileToUpload);
    formData.append('postId', postId);
    formData.append('userId',userId);
    return this.postWithFile(formData, '/userpost/file/upload');
  }

  private getFormData(key: string, fileToUpload: File): FormData {
    const formData = new FormData();
    formData.append(key, fileToUpload, fileToUpload.name);
    return formData;
  }

  getProfileAvatarUrl(userId: string, largeSize: boolean = false, bustCache: boolean = false): string {

    const fileName = largeSize ? 'avatar_160x160.jpg' : 'avatar_32x32.jpg';
    return this.combineUrl(`images/${userId}/avatar/${fileName}`, bustCache);
  }

  getDefaultAvatarUrl(userId: string, bustCache: boolean = false): string {

    return (`https://avatars.dicebear.com/v2/identicon/${userId}.svg`);
  }

  getGameImageUrl(gameId: string, bustCache: boolean = false): string {

    return this.combineUrl(`images/games/${gameId}.jpg`, bustCache);
  }

  getPostFileUrl(userId: string, postId: string, fileName: string, bustCache: boolean = false): string {

    return this.combineUrl(`/posts/${userId}/${postId}/${fileName}`, bustCache);
  }

  private combineUrl(appendPath: string, bustCache: boolean = false): string {

    let url = this.utilityService.combineUrl(this.cdnBaseUrl, appendPath);

   

    if (this.avatarImgCacheBustValue === 0) {
      this.burstAvatarImgCache();
      url = `${url}?v=${this.avatarImgCacheBustValue}`;
    } else {
      url = `${url}?v=${this.avatarImgCacheBustValue}`;
    }

    return url;
    }


    userAvatarExists(userId: string): Observable<boolean> {

      var userData = this.avatarData.find(x => x.userId === userId);

      return  userData != undefined
        ? of(userData.avatarExists)
        : this.get<any>(null, `/profile/verifyAvatar/${userId}`).pipe(map((item: any) => {

          this.avatarData.push({
            userId: userId,
            avatarExists: item.verified
          });
          return item.verified;
        }));
    }

    
}

class AvatarData {
    userId: string;
    avatarExists: boolean;
}
