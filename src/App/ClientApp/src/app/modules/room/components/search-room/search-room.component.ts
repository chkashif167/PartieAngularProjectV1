import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'partie-search-room',
  templateUrl: './search-room.component.html',
  styleUrls: ['./search-room.component.css']
})
export class SearchRoomComponent implements OnInit {

  @Output('search') onSearch = new EventEmitter<any>();
  roomDisplayName: string;

  ngOnInit() {
  }

  search(): void {

      const displayName =   this.roomDisplayName;
    if (displayName && displayName.length >= 3) {
      this.onSearch.emit(displayName.trimRight());
      return;
    }
    if (!displayName) {
      this.onSearch.emit();
    }
  }
}
