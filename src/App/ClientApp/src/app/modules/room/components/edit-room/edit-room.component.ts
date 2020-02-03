import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

//components
import { RoomTagsComponent } from '@partie/room/components/room-tags/room-tags.component';

//Service
import { RoomService } from '@partie/room/services/room.service';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';

//Models
import { EditRoom, GetRoomResponse, RoomTag } from '@partie/room/models/room.model';


@Component({
  selector: 'partie-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {

  id: string;
  model: EditRoom;
  roomTags: string[];
  selectedTags: string;
  //showTagsErrorMsg : boolean;
  gameTags: RoomTag[];

  private teardown$ = new Subject<void>();

  @ViewChild(RoomTagsComponent) roomTagsComponent: RoomTagsComponent;

  constructor(
    private readonly dialog: DialogRef,
    private readonly roomService: RoomService) {

    this.model = new EditRoom();
    this.roomTags = new Array<string>();
    this.gameTags = [];
  }

  ngOnInit() {
   // this.showTagsErrorMsg = false;

    this.roomService.getRoom(this.id)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: GetRoomResponse) => {
        const r = new EditRoom();
        r.id = resp.id;
        r.displayName = resp.displayName;
        r.description = resp.description;
        r.tags = resp.tags;
        r.gameId = resp.gameId;
        r.gameTitle = resp.gameTitle;
        r.private = resp.private;
        this.model = r;
          this.roomTags = null;
          if (r.tags) {
            this.roomTags = [...r.tags.split(',').map(x => x.trim())];
          }
        
        //TODO:HS: Find another way
        //this.roomTagsComponent.markSelectedTags(this.roomTags);
      });
  }

  roomPrivacyChanged(): void {
    this.model.private = !this.model.private;
  }

  close(): void {
    this.dialog.close();
  }

  submit(): void {

    //if(this.selectedTags == undefined || this.selectedTags.length <= 0){
    //  this.showTagsErrorMsg = true;
    //  return;
    //}
    if (this.selectedTags)
      this.model.tags = this.selectedTags;
    else
      this.model.tags = null;
    this.roomService.editRoom(this.model)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: EditRoom) => {
        this.close();
      });
  }

  updateSelectedTags(tags:string):void{
    this.selectedTags = tags;
   // this.showTagsErrorMsg = this.selectedTags.length <= 0;     
} 

}
