import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { ApiBaseService } from '@partie/shared/services/api-base.service';

//Services
import { SignalRService } from '@partie/core/services/signalr.service';

//Models
import { Conversation, MessageThread, ThreadDetail, MessageThreadContainer, ThreadParticipant } from '../models/direct-message.model'
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class DirectChatService extends ApiBaseService implements OnDestroy {

  private messageThreads = new BehaviorSubject<MessageThread[]>([]);
  messageThreads$ = this.messageThreads.asObservable();
  directMessagingAllowed: boolean;
  private teardown$ = new Subject<void>();

  private conversation = new BehaviorSubject<Conversation[]>([]);
  conversation$ = this.conversation.asObservable();
  forUser = new ThreadParticipant();
  toUser = new ThreadParticipant();

  private pushChangesSubscribed: boolean;



  getThreads(): void { 
    this.get(null, '/directmessages')
      .subscribe((resp: MessageThreadContainer) => {
        this.directMessagingAllowed = resp.forUserDirectMessagingAllowed;
        this.messageThreads.next(resp.threads);
        this.subscribeToServerPushChanges();
      });
  }

  getThreadMessages(userId: string): void {

    this.get(userId, '/directmessages')
      .subscribe((resp: ThreadDetail) => {
        this.conversation.next(resp.messages || new Array<Conversation>());
        this.forUser = resp.forUser;
        this.toUser = resp.toUser;
        this.directMessagingAllowed = resp.forUser.directMessagingAllowed;
        this.subscribeToServerPushChanges();
      });
  }

  addMessage(message: Conversation): void {
    let list = this.conversation.getValue();
    const found = list.find(x => x.id === message.id);
    if(found) return;
    list.push(message);
    list = [...list];
    this.conversation.next(list);

  }

  getTotalMessages(): number {
    const list = this.conversation.getValue();
    return list.length;
  }

  deleteThreadMessage(messageId: string): void { // Observable<number>
    this.post<any, number>({ messageId: messageId }, '/directmessages/delete')
      .subscribe((resp: number) => {
        let list = this.conversation.getValue();
        if (resp === 1) {
          list = this.updateDeletedMessage(messageId, this.forUser.id, list);
          this.conversation.next(list);
        }
      });
  }

  emptyConversation(): void {
    this.conversation.next([]);
    this.toUser = new ThreadParticipant();
  }

  private updateDeletedMessage(messageId: string, deletedByUserId: string, list: Conversation[]): Conversation[] {
    const msg = list.filter(x => x.id === messageId)[0];
    if (!msg) return list;
    const msgSentByUserId = msg.userId;
    if (msgSentByUserId === deletedByUserId) {
      msg.message = 'This message was deleted.';
      msg.deleted = true;
      this.subscribeToServerPushChanges();
    } else if(this.forUser.id === deletedByUserId) {
      list = list.filter(x => x.id !== messageId);
    }

    return list;
  }

  private subscribeToServerPushChanges(): void {
    if (this.pushChangesSubscribed) return;

    this.uiUpdateManager.directMessageDeleted
      .pipe(takeUntil(this.teardown$))
      .subscribe((pl: any) => {

        const list = this.updateDeletedMessage(pl.messageId, pl.deletedById, this.conversation.getValue());
        this.conversation.next(list);
        //this.getThreadMessages(this.toUser.id);
        this.getThreads();
      });

    this.pushChangesSubscribed = true;
  }




  ngOnDestroy(): void {
    this.teardown$.next();
    this.teardown$.complete();
  }
}
