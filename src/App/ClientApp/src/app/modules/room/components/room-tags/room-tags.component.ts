import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs//operators';

import { RoomTag } from '@partie/room/models/room.model';
import { Game } from '@partie/game/models/game.model';

import { GameService } from '@partie/game/services/game.service';


@Component({
  selector: 'partie-room-tags',
  templateUrl: './room-tags.component.html'
})
export class RoomTagsComponent implements OnInit, OnDestroy {

  @Input() selectedTags: string[];
  @Input() allTags: RoomTag[];
  @Input() gameId: string = null;

  @Output('selectedTagString') updatedTags = new EventEmitter<string>();

  private teardown$ = new Subject<void>();

  constructor(private readonly gameService: GameService) {

  }

  ngOnInit() {

    if (!this.allTags) {
      this.bindTags();
    }
  }

  private bindTags() {

    if (!this.gameId) {
      throw new Error('Please provide game id');
    }

    this.allTags = [];
    this.gameService.getGame(this.gameId)
      .pipe(takeUntil(this.teardown$))
      .subscribe((resp: Game) => {

        const tags = resp.tags.split(',');
        tags.forEach(t => {

          const roomTag = new RoomTag();
            roomTag.name = t;
            this.allTags.push(roomTag);
            
        });
        this.markSelectedTags();
      });
  }

  markSelectedTags(selTags: string[] = undefined): void {

    if (selTags) {
      this.selectedTags = selTags;
      }

      if (this.selectedTags) {
        this.allTags = this.allTags.map(tag => {
          const t = this.selectedTags.filter(name => tag.name === name)[0];
          if (t) {
            tag.selected = true;
          }
          return tag;
        });

        this.updateSelectedTags();
      }
    
  }

  toggleTag(i): void {

    const tag = this.allTags[i];
    tag.selected = !tag.selected;

    this.updateSelectedTags();
  }

  private updateSelectedTags(): void {
    this.selectedTags = this.allTags.filter(x => x.selected).map(t => t.name);
    this.updatedTags.emit(this.selectedTags.join(','));
  }
  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }

}
