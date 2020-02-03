import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, delay } from 'rxjs//operators';

//Services
import { RoomService } from '@partie/room/services/room.service';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';
import { SignalRService } from '@partie/core/services/signalr.service';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';
import { GamePlatformMapService } from '@partie/shared/services/game-platform-map/game-platform-map.service';


//Models
import { SearchRoomResponse, SearchRoomRequest } from '@partie/room/models/room.model';
import { GamePlatformMap } from '@partie/shared/models/game-platform-map/game-platform-map.model';

@Component({
    selector: 'partie-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit, OnDestroy {

    rooms: SearchRoomResponse[];
    

    //Private fields
    private teardown$ = new Subject<void>();

    constructor(private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly roomService: RoomService,
        private readonly toastrService: PartieToastrService,
        private readonly signalRService: SignalRService,
        private readonly uiUpdateManager: UiUpdatesManagerService,
        ) {
        this.rooms = [];
    }

    ngOnInit() {

        this.subscribeToServerPushChanges();
        this.route.queryParams
            .pipe(takeUntil(this.teardown$))
            .subscribe(qp => {
                const keyword = qp['keyword'] || '';
                this.searchRooms(keyword);
            });


        //Update partie list on room commenced.
        this.signalRService.getFromServer('broadcastMessage', (name: string, payload: any) => {
            if (name === 'PartieCommenced') {
                if (this.rooms && this.rooms.filter(x => x.id === payload.roomId).length > 0) {
                    const room = this.rooms.filter(x => x.id === payload.roomId)[0];

                    if (room.alreadyJoined) {
                        room.myCommencedPartie = true;
                    } else {
                        this.rooms = this.rooms.filter(x => x.id !== payload.roomId);
                    }


                }
            }
        });


    }

    private searchRooms(keyword = ''): void {

        const request = new SearchRoomRequest();
        request.keyword = keyword;
        request.templateId = null;
        this.roomService.searchRooms(request)
            .pipe(takeUntil(this.teardown$))
            .subscribe((resp: SearchRoomResponse[]) => {
                this.rooms = resp;
                for (let room of this.rooms) {
                    room = room as SearchRoomResponse;
                    if (room.tags) {
                        room.tagsList = room.tags.split(',');
                    }
                }
            });
    }

    addRoom(): void {

        this.router.navigate(['partie/create']);
    }

    search(roomDisplayName: string): void {

        this.searchRooms(roomDisplayName);

    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }

    private subscribeToServerPushChanges(): void {
        this.uiUpdateManager.partieNameUpdated
            .pipe(takeUntil(this.teardown$))
            .subscribe((pl: any) => {
                if (this.rooms && this.rooms.filter(x => x.id === pl.roomId).length > 0) {
                    const room = this.rooms.filter(x => x.id === pl.roomId)[0];
                    room.displayName = pl.name;
                    room.description = pl.description;
                }
            });

    }


}
