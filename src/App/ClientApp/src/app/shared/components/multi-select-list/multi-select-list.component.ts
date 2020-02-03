import { Component, OnInit } from '@angular/core';

//Models
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { DialogConfig } from '@partie/shared/models/dialog/dialog-config';

//Model
import { MultiSelectListItem } from '@partie/shared/models/multi-select-list-item/multi-select-list-item';
import { UserGamePlatform } from '../../../modules/game/models/game.model';
import { PartieToastrService } from '@partie/core/services/partie-toastr.service';

@Component({
    selector: 'partie-multi-select-list',
    templateUrl: './multi-select-list.component.html',
    styleUrls: ['./multi-select-list.component.css']
})
export class MultiSelectListComponent implements OnInit {

    title: string;
    listItems: MultiSelectListItem[] = [];
    selectedItemsStr: string;
    gamePlatforms: UserGamePlatform[] = [];

    constructor(public config: DialogConfig,
        public dialog: DialogRef,
        private readonly partieToastService: PartieToastrService) {
    }

    ngOnInit(): void {
    }

    onValueChange(item: MultiSelectListItem) {

        this.listItems.filter(x => x.name === item.name)[0].isChecked = item.isChecked;
        this.dialog.change(item);

    }

    onBackButtonClick(evt: MouseEvent) {
        if (this.listItems.filter(x=>x.isChecked).length <= 3) {
            const platforms = this.listItems.filter(x => x.isChecked).map(i => {
                this.gamePlatforms.push({ gamingPlatform: i.name.toString(), gamerId: "Sample" });
            });
        } else {
            this.partieToastService.warning("You can only select three platforms.");
        }
        //this.selectedItemsStr = platforms.join(', ');
        this.dialog.close(this.gamePlatforms);
    }

    onDialogClick(evt: MouseEvent) {
        evt.stopPropagation();
    }
}
