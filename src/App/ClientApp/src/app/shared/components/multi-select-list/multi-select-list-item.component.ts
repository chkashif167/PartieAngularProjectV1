import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

//Models
import { MultiSelectListItem } from '@partie/shared/models/multi-select-list-item/multi-select-list-item';

@Component({
  selector: 'partie-multi-select-list-item',
  templateUrl: './multi-select-list-item.component.html'
})
export class MultiSelectListItemComponent implements OnInit {

  private listItem = new MultiSelectListItem();

  @Input() name: string;
  @Input() checked: boolean = false;
  @Output() valueChange = new EventEmitter();

  ngOnInit() {
  }

  toggleCheckboxClass() {

    this.listItem.name = this.name;

    if (this.checked) {
      this.checked = false;
      this.listItem.isChecked = false;
    } else {
      this.checked = true;
      this.listItem.isChecked = true;
    }
    this.valueChange.emit(this.listItem);
  }
}
