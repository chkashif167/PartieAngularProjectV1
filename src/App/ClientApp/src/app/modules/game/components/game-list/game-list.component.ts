import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

//Models
import { Game } from '@partie/game/models/game.model';

//Services
import { GameService } from '@partie/game/services/game.service';
import { GamePlatformMapService } from '@partie/shared/services/game-platform-map/game-platform-map.service';

@Component({
  selector: 'partie-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {

  games: Game[];

  //Private fields
  private teardown$ = new Subject<void>();


    constructor(private readonly gameService: GameService,
      private readonly mapService: GamePlatformMapService) {
    this.games = [];
  }

  ngOnInit() {
    this.mapService.createGamePlatformMap();
    this.getGames();
  }

  private getGames(title = null): void {
    this.gameService.search(title)
      .pipe(takeUntil(this.teardown$))
        .subscribe((games: Game[]) => {
            this.games = games;
      });
  }

  search(gameTitle: string): void {
    this.getGames(gameTitle);
  }

  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

}
