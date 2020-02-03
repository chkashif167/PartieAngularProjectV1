
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ContextMenu } from '@partie/theme/models/context-menu.model';

@Component({
  selector: 'partie-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrls: ['./drawer-menu.component.css']
})
export class DrawerMenuComponent implements OnInit {

  @Input() menu: ContextMenu[];
  @Output() menuClick: EventEmitter<ContextMenu> = new EventEmitter<ContextMenu>();


  showMenu: boolean = false;
  

  constructor() { }

  ngOnInit() {
  }

  toggleMenu(value:boolean): void {
    this.showMenu = value;
  }

  menuClickHandler(menuItem: ContextMenu): void {
    this.menuClick.emit(menuItem);
  }

  trackByFn(index, item) {
    return item.id;
  }

}
