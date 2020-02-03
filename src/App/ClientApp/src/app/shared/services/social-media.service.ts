import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SocialMedia } from '@partie/shared/models/social-media/social-media.model';


@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
   
    private modelSource = new ReplaySubject<SocialMedia>(1);
    currentModel = this.modelSource.asObservable();
    constructor() { }

    changeModel(model: SocialMedia) {
      this.modelSource.next(model);
    }
}
