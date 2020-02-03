import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'partie-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.css']
})
export class TermsandconditionsComponent implements OnInit {
  @Input() isActive : boolean = false;
  @Output() TermsModalStatus = new EventEmitter()


  constructor() { }

  ngOnInit() {
  }

  closeTermsPopup() {
  this.isActive = !this.isActive;
  this.TermsModalStatus.emit(this.isActive);
  }

}
