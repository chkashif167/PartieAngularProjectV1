export class MultiSelectListItem {

    constructor(id: string = '', name: string = '', selected: boolean = false, gamerId = '') {
        this.id = id;
        this.name = name;
        this.gamerId = gamerId;
        this.isChecked = selected;
    }

    id: string;
    name: string;
    gamerId: string;
    isChecked: boolean;
}
