import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'partie-create-template',
    templateUrl: './create-template.component.html',
    styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

    @Output() close = new EventEmitter<string>();
    name: string;
    constructor() { }

    ngOnInit() {

    }
    onSubmit(templateName: string) {
        this.name = templateName;
        this.closeDialogBox(this.name);
    }
    onClose() {
       this.closeDialogBox(null);
    }

    closeDialogBox(name: string) {
      this.close.emit(name);
    }
}
