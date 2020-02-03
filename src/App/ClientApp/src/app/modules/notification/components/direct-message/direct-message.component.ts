import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'partie-direct-message',
  template: `<button class= "btn btn-bare"(click) = "view()" > <img src="/assets/images/icons/24px/chat.svg" alt = "Chat Icon" > </button>`

    
})
export class DirectMessageComponent implements OnInit {
  @Input() fromUserId: string;
  @Output('onRead') markRead: EventEmitter<null>;

  constructor(private readonly router: Router) {
    this.markRead = new EventEmitter();
  }


  ngOnInit() {
  }

  view() {
    this.markRead.emit();
    this.router.navigateByUrl(`/messages/conversation/${this.fromUserId}`);
  }

}
