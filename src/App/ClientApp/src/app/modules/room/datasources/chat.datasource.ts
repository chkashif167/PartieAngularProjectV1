import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription, } from 'rxjs';


import { ChatMessageResponse } from '@partie/room/models/chat-message.model';

import { RoomService } from '@partie/room/services/room.service';
import { FileService } from '@partie/core/services/file.service';

export class ChatDataSource extends DataSource<ChatMessageResponse | ChatMessageResponse[]> {

  private roomId: string;
  private length = 100000;
  private pageSize = 100;
  private cachedData = Array.from<ChatMessageResponse>({ length: this.length });
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<(ChatMessageResponse | undefined)[]>(this.cachedData);
  private subscription = new Subscription();

  constructor(roomId: string,
    private readonly roomService: RoomService,
    private readonly fileService: FileService) {
    super();
    this.roomId = roomId;
    this.cachedData = [];
  }

  connect(collectionViewer: CollectionViewer): Observable<(ChatMessageResponse | undefined)[]> {

    //this.subscription.add(collectionViewer.viewChange.subscribe(range => {
    //  const startRange = this.getPageForIndex(range.start);
    //  const startPage = startRange === 0 ? 1 : startRange;
    //  const endPage = this.getPageForIndex(range.end - 1);
    //  for (let i = startPage; i <= endPage; i++) {
    //    this.loadChat(i);
    //  }
    //}));
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  addChat(message: ChatMessageResponse): void {

    this.cachedData.push(message);
    this.dataStream.next(this.cachedData);
  }

  loadChat(page: number): void {

    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);

    this.roomService.getRoomChat(this.roomId, page, this.pageSize)
      .subscribe(resp => {
        this.cachedData = resp.reverse();
        this.dataStream.next(resp);
      });
  }

  getChatDataLength(): number {
    return this.cachedData.length;
  }
}
