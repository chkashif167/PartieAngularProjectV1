import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@aspnet/signalr';
import { Subject, observable } from 'rxjs';


import { AuthService } from '@partie/core/services/auth.service';
import { MessageBus } from '@partie/core/message-bus/message-bus';
import { Conversation } from '@partie/direct-messaging/models/direct-message.model';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  unSentMessageQueue: MessageQueue[] = [];

  constructor(private readonly authService: AuthService,
    private readonly messageBus: MessageBus) {

  }

  //Properties
  private directMessage = new Subject<Conversation>();
  directMessageReceived$ = this.directMessage.asObservable();
  private hubConnection: HubConnection;
 
  //Functions
  connect(url: string): void {

    const user = this.authService.getUser();
    const userId = this.authService.getClaims() ? this.authService.getClaims().sub : null;
    url = userId ? `${url}?userId=${userId}` : url;
    this.hubConnection = new HubConnectionBuilder().withUrl(url,
      {
        //skipNegotiation: true,
        accessTokenFactory: () => user ? user.access_token : null
      })
      .configureLogging(LogLevel.Warning)
      .build();

    this.hubConnection.onclose(error => {
      console.error('Chat hub disconnected: ', error);
    });
  }

  private registerServerMethods(): void {
    this.getFromServer('private-message', this.publishPrivateMessage.bind(this));
  }
  
  private publishPrivateMessage(fromUserId: string,
    fromUserName: string,
    msgId: string,
    msg: string,
    timestamp: string) {
    const newMessage = new Conversation();
    newMessage.userId = fromUserId;
    newMessage.userName = fromUserName;
    newMessage.id = msgId;
    newMessage.message = msg;
    newMessage.timestamp = timestamp;

    this.directMessage.next(newMessage);
  }

  start(): Promise<void> {

    this.registerServerMethods();

    const promise = this.hubConnection.start();
    promise.then(() => {
      this.messageBus.start();
      this.resendQueuedMessages();
    });
    promise.catch(err => console.log('Error while establishing connection :('));
    return promise;
  }

  stop(): void {

    const promise = this.hubConnection.stop();
    promise.then(() => {
      console.log('SignalR connection disconnected');
      this.messageBus.stop();
    });
  }

  removeMethodSubscription(methodName: string, callBack: (...args: any[]) => void): void {
    this.hubConnection.off(methodName, callBack);
  }

  getFromServer(methodName: string, callBack: (...args: any[]) => void): void {

    this.hubConnection.on(methodName, callBack);

  }

  sendToServer(methodName: string, ...args: any[]): Promise<any> {


    return this.hubConnection.invoke(methodName, ...args)
      .catch(err => {
        console.error(err);
        this.addQueueMessage(methodName, ...args);
      });
  }

  isConnected(): boolean {
    return this.hubConnection.state === HubConnectionState.Connected;
  }

  resendQueuedMessages(): void {

    if (this.unSentMessageQueue.length > 0) {
      this.unSentMessageQueue.forEach(value => {
        this.sendToServer(value.methodName, ...value.args);
        const index = this.unSentMessageQueue.indexOf(value);
        if (index != -1) {
          this.unSentMessageQueue.splice(index, 1);
        }
      });
    }
  }

  addQueueMessage(methodName: string, ...args: any[]): void {
    var msg = new MessageQueue();
    msg.methodName = methodName;
    msg.args = args;
    this.unSentMessageQueue.push(msg);
  }

}

export class MessageQueue {
  methodName: string;
  args: any[]
}
