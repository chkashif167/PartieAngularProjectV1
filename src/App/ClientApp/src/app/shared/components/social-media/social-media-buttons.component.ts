import { Component, OnInit } from '@angular/core';
import { SocialMedia } from "@partie/shared/models/social-media/social-media.model";
import { SocialMediaService } from "@partie/shared/services/social-media.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'partie-social-media-buttons',
    templateUrl: './social-media-buttons.component.html'
})
export class SocialMediaButtonsComponent implements OnInit {

    appUrl: string;
    theme: string;
    model: SocialMedia;
    private teardown$ = new Subject<void>();

    constructor(private socialMediaService: SocialMediaService) { }

    ngOnInit() {
        this.theme = 'circles-light';
        this.socialMediaService.currentModel
          .pipe(takeUntil(this.teardown$)).subscribe((model:SocialMedia) => this.model = model);
        this.appUrl = this.model.url;

    }

    ngOnDestroy(): void {

      this.teardown$.next();
      this.teardown$.complete();
    }

}
