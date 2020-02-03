import { Component, OnInit } from '@angular/core';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { SocialMedia } from '@partie/shared/models/social-media/social-media.model';
import { SocialMediaService } from "@partie/shared/services/social-media.service";


@Component({
    selector: 'partie-social-media-dialog',
    templateUrl: './social-media-dialog.component.html'
})
export class SocialMediaDialogComponent implements OnInit {

    model: SocialMedia;
    title:string;

    constructor(public dialog: DialogRef, private socialMediaService: SocialMediaService) { }

    ngOnInit() {
        this.socialMediaService.changeModel(this.model);
    }

    onClose() {
        this.dialog.close();
    }


}
