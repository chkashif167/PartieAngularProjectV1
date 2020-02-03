import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'partie-search-game',
  templateUrl: './search-game.component.html',
  styleUrls: ['./search-game.component.css']
})
export class SearchGameComponent implements OnInit {

  @Output('search') onSearch = new EventEmitter();
  gameTitle: string;

  ngOnInit() {
  }

  search(): void {

    const gameTitle = this.gameTitle.trimLeft().trimRight();
    if (gameTitle.length >= 3) {
      this.onSearch.emit(gameTitle);
      return;
    }
    if (!gameTitle) {
      this.onSearch.emit();
    }
  }
}
