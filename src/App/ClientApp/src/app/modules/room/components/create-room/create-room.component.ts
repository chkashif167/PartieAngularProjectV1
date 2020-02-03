import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

//Models

import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { CreateRoom, RoomTag, CreateRoomRequest } from '@partie/room/models/room.model';
//import { GameType, GamePlatform, RoleName, Expertise} from '@partie/game/models/gameType.model';

//Services
import { RoomService } from '@partie/room/services/room.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { ICurrentUser, CurrentUserService } from '@partie/core/services/current-user.service';
import { GamePlatformMapService } from '@partie/shared/services/game-platform-map/game-platform-map.service';

@Component({
    selector: 'partie-create-room',
    templateUrl: './create-room.component.html',
    styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

    model: CreateRoom;
    createRoomRequest : CreateRoomRequest;
    //gameTypes: GameType[];
    gameTypes: string[];
    gameTags: RoomTag[];
    gamePlatforms: string[];
    roleNames: string[];
    expertise: string[];

    selectedTags: string;
    showTagsErrorMsg: boolean;
    termsIsActive: boolean = false;
    showTemplateNameDialogue: boolean = false;
    platforms : string[];

    //Private fields
    private teardown$ = new Subject<void>();

    constructor(private readonly dialog: DialogRef,
      //private readonly dialogService: DialogService,
        private readonly roomService: RoomService,
        private readonly router: Router,
        private readonly partieToastrService: PartieToastrService,
        private readonly currentUserService: CurrentUserService,
        private readonly gamePlatformMapService: GamePlatformMapService) {

        this.gameTypes = [];
        this.gameTags = [];
        this.gamePlatforms = [];
        this.roleNames = [];
        this.expertise = [];
    }

    ngOnInit() {
        this.showTagsErrorMsg = false;
        this.createRoomRequest = new CreateRoomRequest();

        this.currentUserService.afterCurrentUserChanged
          .pipe(takeUntil(this.teardown$))
            .subscribe((u: ICurrentUser) => {

                if (u.gamingPlatforms.length > 0) {

                  this.platforms = this.gamePlatformMapService.getMatchedGamePlatforms(this.model.gamePlatforms,
                      u.gamingPlatforms.map(x => x.gamingPlatform).join(','));

                    this.gamePlatforms = this.platforms;

                } else {
                    this.gamePlatforms = null;
                }

                this.buildRoomData();
          });

    }

    buildRoomData() {

      this.model.gameTags.split(',').forEach(tag => {

        const tagItem = new RoomTag();
        tagItem.name = tag;
        tag === "MIC" ? tagItem.selected = true : tagItem.selected = false;
        this.gameTags.push(tagItem);
        this.updateSelectedTags(tagItem.name);
      });

      if (this.model.gameTypes) {
        this.gameTypes = this.model.gameTypes.split(',');
      }

      if (this.model.roleName) {
        this.roleNames = this.model.roleName.split(',');
      }

      this.expertise = this.model.expertise.split(',');
    }

    onPrivacyChange(): void {

        let privacy = this.createRoomRequest.private;
        privacy = !privacy;
        this.createRoomRequest.private = privacy;
    }

    onCreateTemplateChange(): void {

        let template = this.createRoomRequest.addTemplate;
        template = !template;
        this.createRoomRequest.addTemplate = template;
    }
    onAddToFeedChange(): void {

        let feed = this.createRoomRequest.addPost;
        feed = !feed;
        this.createRoomRequest.addPost = feed;
    }

    onTermsAndConditionsChange(): void {

        let termsAndConditionsAccepted = this.createRoomRequest.termsAndConditionsAccepted;
        termsAndConditionsAccepted = !termsAndConditionsAccepted;
        this.createRoomRequest.termsAndConditionsAccepted = termsAndConditionsAccepted;

    }

    updateSelectedTags(tags: string): void {
        this.selectedTags = tags;
        //this.showTagsErrorMsg = this.selectedTags.length <= 0;
    }

    onSubmit(): void {

        if (!this.createRoomRequest.termsAndConditionsAccepted) {

            this.partieToastrService.error("Please accept terms and conditions then proceed");
            return;
        }
 
        this.model.gameTags = this.selectedTags;
        
        this.createRoomRequest.tags = this.selectedTags;
        if (!this.selectedTags.split(',').find(x => x === 'MIC')) {
          this.createRoomRequest.comPreference = false;
        }
         
        this.createRoomRequest.gameId = this.model.gameId;

        if (this.createRoomRequest.addTemplate) {
            this.showTemplateNameDialogue = true;
        } else {
          this.createRoom();
        }
        
    }

    createRoom() {
      this.roomService.addRoom(this.createRoomRequest)
        .pipe(takeUntil(this.teardown$))
        .subscribe(resp => {
            this.onCreateRoomDialogClose(null);
          this.router.navigate(['partie']);
        });
    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }

    onCreateRoomDialogClose(evt: MouseEvent) {
        this.dialog.close();
    }

    onDialogClick(evt: MouseEvent) {
        evt.stopPropagation();
    }

    openTermsPopup() {
      this.termsIsActive = true;

    }
    closeTermsPopup($event) {
        this.termsIsActive = false;
    }

    closeCreateTemplateDialog(name: string) {
        this.showTemplateNameDialogue = false;
        if (name) {
            this.createRoomRequest.templateName = name;
            this.createRoom();
        }
    }

    
}
