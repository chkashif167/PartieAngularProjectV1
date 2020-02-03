import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

//Services
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { FileService } from '@partie/core/services/file.service';

//Models
import { CreateRoom } from '@partie/room/models/room.model';
import { Game } from '@partie/game/models/game.model';

@Component({
    selector: 'partie-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    @Input() game: Game;
    gameImage: string;

    //Private fields
    private teardown$ = new Subject<void>();

    constructor(private readonly dialogService: DialogService,
        private readonly fileService: FileService) { }

    ngOnInit() {

        this.gameImage = this.fileService.getGameImageUrl(this.game.id);
    }

    addRoom(): void {

        const model = new CreateRoom();
        model.gameId = this.game.id;
        model.gameTitle = this.game.title;
        model.gameTags = this.game.tags;
        model.gameTypes = this.game.gameTypes;
        model.expertise = this.game.expertise;
        model.roleName = this.game.roleNames;
        model.gamePlatforms = this.game.gamePlatforms;
        const dlg = this.dialogService.openCreateRoomDialog('Room', model);
        dlg.afterClosed
            .pipe(takeUntil(this.teardown$))
            .subscribe((gp: string) => {

                console.log(gp);
            });
    }

    ngOnDestroy(): void {
        this.teardown$.next();
        this.teardown$.complete();
    }
}
