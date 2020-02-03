import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Datasource } from 'ngx-ui-scroll';



//Services
import { DirectChatService } from '@partie/direct-messaging/services/direct-chat.service'
import { FileService } from '@partie/core/services/file.service';
import { SignalRService } from '@partie/core/services/signalr.service';
import { MessageBus } from '@partie/core/message-bus/message-bus';
import { EmojiService } from '@partie/core/services/emoji.service';
import { DialogService } from '@partie/shared/services/dialog/dialog.service';
import { VirtualScrollWrapperService } from '@partie/core/services/virtual-scroll-wrapper.service';

//Models
import {  Conversation } from '@partie/direct-messaging/models/direct-message.model';
import { ActionConfirmation } from '@partie/shared/models/action-confirmation/action-confirmation.model';
import { UiUpdatesManagerService } from '@partie/core/services/ui-updates-manager.service';

@Component({
  selector: 'partie-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
  providers: [VirtualScrollWrapperService]
})
export class ConversationComponent implements OnInit, OnDestroy {

  private teardown$ = new Subject<void>();

  toUserId: string;
  message: string;
  showEmojiMart = false;

  @ViewChild('msgViewport') viewportElement:ElementRef;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly renderer: Renderer2,
    private readonly fileService: FileService,
    private readonly signalRService: SignalRService,
    private readonly messageBus: MessageBus,
    public readonly messagesService: DirectChatService,
    private readonly dialogService: DialogService,
    private readonly emojiService: EmojiService,
    private readonly uiUpdateManager: UiUpdatesManagerService,
    public virtualScrollService: VirtualScrollWrapperService) {

    
    //replace bg-dark by bg-black
    this.renderer.removeClass(document.body, 'bg-dark');
    this.renderer.addClass(document.body, 'bg-black');
  }

  ngOnInit() {

    this.toUserId = this.route.snapshot.params['id'];

    //this.messages = [];
    this.messagesService.getThreadMessages(this.toUserId);
    this.registerChatHubMethods();

    this.messagesService.conversation$
      .pipe(takeUntil(this.teardown$))
      .subscribe((list: Conversation[]) => {
        const { dataSource } = this.virtualScrollService;
        const messages = this.virtualScrollService.getData();
        //First time binding
        if (list.length > 0 && !dataSource) {
          this.virtualScrollService.viewportElement = this.viewportElement;
          this.virtualScrollService.appendData(list);

        }
        else if (list.length < messages.length) {
          const difference = messages.filter(x => !list.includes(x));
          this.virtualScrollService.removeData(difference);

        }
      });


  }

  addEmoji($event): void {

    this.message = this.message == undefined
      ? $event.emoji.native
      : `${this.message}${$event.emoji.native}`;
  }

  toggleEmojiMart(): void {

    this.showEmojiMart = !this.showEmojiMart;
  }

  getAvatarUrl(toUserId: string): string {
    return this.fileService.getProfileAvatarUrl(toUserId);
  }

  getDefaultAvatarUrl(toUserId: string): string {
    return this.fileService.getDefaultAvatarUrl(toUserId);
  }


  sendMessage(): void {

    if (!this.message) return;

    if (!this.signalRService.isConnected()) {
      this.signalRService.start();
    }
    const fromUserName = this.messagesService.forUser.displayName;

    this.message = this.emojiService.replaceEmoji(this.message);
    this.signalRService.sendToServer('sendPrivateMessage', this.toUserId, fromUserName, this.message);
    this.message = '';
    this.showEmojiMart = false;
  }

  onMessageFocused() {
    this.showEmojiMart = false;
  }


  ngOnDestroy(): void {
    
    this.teardown$.next();
    this.teardown$.complete();
    this.messagesService.emptyConversation();

    //replace bg-black by bg-dark
    this.renderer.removeClass(document.body, 'bg-black');
    this.renderer.addClass(document.body, 'bg-dark');
  }
  
  private registerChatHubMethods(): void {

    this.signalRService.directMessageReceived$
      .pipe(takeUntil(this.teardown$))
      .subscribe((newMessage: Conversation) => {
        this.messagesService.addMessage(newMessage);
        
        this.virtualScrollService.appendData(newMessage);
      });
  }

  deleteMessage(msgId: string): void {

    const model = new ActionConfirmation();

    model.modelClass = 'leave-modal deleteConversation';
    model.heading = 'Are you sure you want to delete message';

    const dlg = this.dialogService.openActionConfirmation(model);

    dlg.afterClosed.pipe(takeUntil(this.teardown$)).subscribe((action: boolean) => {

        if (action) {
          this.messagesService.deleteThreadMessage(msgId);
        }
    });

    }

  formatTimestamp(dateTime: any): string {
    const formatOptions = {
      hour12: true,
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };

      const tmp = new Date(dateTime).toLocaleString('en-GB', formatOptions);
      return tmp.replace(' ', '-').replace(' ', '-');
  }
}
