
import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, Type, EmbeddedViewRef, ComponentRef, Component } from '@angular/core';
import { SharedModule } from '@partie/shared/shared.module';
import { DialogComponent } from '@partie/shared/components/dialog/dialog.component';
import { DialogInjector } from '@partie/shared/models/dialog/dialog-injector';
import { DialogConfig } from '@partie/shared/models/dialog/dialog-config';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';

import { MultiSelectListComponent } from '@partie/shared/components/multi-select-list/multi-select-list.component';
import { FriendsListComponent } from '@partie/shared/components/friends-list/friends-list.component';
import { BadgeStatsComponent } from '@partie/shared/components/badge-stats/badge-stats.component';

import { CreateRoomComponent } from '@partie/modules/room/components/create-room/create-room.component'
import { CreateRoom, JoinRoom } from '@partie/modules/room/models/room.model';
import { JoinRoomComponent } from '@partie/shared/components/room/join-room.component';
import { JoinRoomRequestListComponent } from '@partie/shared/components/room/join-room-request-list/join-room-request-list.component';
import { InviteToRoomComponent } from '@partie/shared/components/room/invite-to-room/invite-to-room.component';
import { ActionConfirmationComponent } from '@partie/shared/components/action-confirmation/action-confirmation.component';
import { EditRoomComponent } from '@partie/modules/room/components/edit-room/edit-room.component'
import { PartieListComponent } from '@partie/modules/profile/components/partie-list/partie-list.component'

//Models
import { Badge, BadgeStats } from '@partie/modules/room/models/rate-host/rate-host.model';
import { MultiSelectListItem } from '@partie/shared/models/multi-select-list-item/multi-select-list-item';
import { ChatParticipant, FriendListChildComponentsEnum, Friend } from '@partie/shared/models/friends-list/friend.model';
import { ActionConfirmation } from '@partie/shared/models/action-confirmation/action-confirmation.model';
import { UserRoomInformation } from '@partie/modules/room/models/room.model';
import { from } from 'rxjs';


@Injectable({
  providedIn: SharedModule
})
export class DialogService {

  openComponentList: OpenDialogDetail[];

  dialogComponentRef: ComponentRef<DialogComponent>;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly appRef: ApplicationRef,
    private readonly injector: Injector) {
    this.openComponentList = new Array<OpenDialogDetail>();
  }

  open(componentType: Type<any>) {
    const dialogRef = this.appendDialogComponentToBody();
    this.dialogComponentRef.instance.childComponentType = componentType;
    return dialogRef;
  }

  openMultiSelect(title: string, items: MultiSelectListItem[]) {
    return this.openDialog(title, MultiSelectListComponent, 'listItems', items);
  }

  openFriendsList(title: string, friends: Friend[], childComponentName: FriendListChildComponentsEnum) {
    return this.openDialog(title, FriendsListComponent, 'friends', friends, childComponentName);
  }

  openActionConfirmation(model: ActionConfirmation) {
    return this.openDialog('', ActionConfirmationComponent, 'model', model);
  }

  openBadgeStatsDialog(title: string, badgeStats: BadgeStats) {
    return this.openDialog(title, BadgeStatsComponent, 'badgeStats', badgeStats);
  }

  openCreateRoomDialog(title: string, model: CreateRoom) {
    return this.openDialog(title, CreateRoomComponent, 'model', model);
  }

  openEditRoomDialog(title, roomId: string) {
    return this.openDialog(title, EditRoomComponent, 'id', roomId);
  }

  openJoinRoomDialog(title: string, model: JoinRoom) {
    return this.openDialog(title, JoinRoomComponent, 'model', model);
  }

  openInvitationDialog(title: string, roomId: string) {
    return this.openDialog(title, InviteToRoomComponent, 'roomId', roomId);
  }

  openJoinRoomRequestsDialog(title: string, roomId: string) {
    return this.openDialog(title, JoinRoomRequestListComponent, 'roomId', roomId);
  }

  openPatriesDialog (title: string, partieList: UserRoomInformation[]) {
    return this.openDialog(title, PartieListComponent, 'partieList', partieList);
    }

  public openDialog(title: string, component: any, dataFieldName: string, data: any, childComponentName: FriendListChildComponentsEnum = null): DialogRef {

    const item = this.openComponentList.filter(x => x.componentName === component.name)[0];
    if (item) {
      return item.componentDialogRef;
    }

    const compName = (component as Component).constructor.name;
    
    const dialogRef = this.appendDialogComponentToBody();
    this.dialogComponentRef.instance.childComponentType = component;
    
    const sub = dialogRef.afterOpened.subscribe((comp: ComponentRef<any>) => {
      comp.instance['title'] = title;
      if (data !== undefined)
        comp.instance[dataFieldName] = data;

      if (childComponentName) {
        comp.instance['childComponentName'] = childComponentName;
      }
      sub.unsubscribe();
    });

    this.openComponentList.push({ componentName: component.name, componentDialogRef: dialogRef });

    return dialogRef;
  }


  private appendDialogComponentToBody(config: DialogConfig = {}) {
    const map = new WeakMap();
    map.set(DialogConfig, config);

    const dialogRef = new DialogRef();
    map.set(DialogRef, dialogRef);

    const sub = dialogRef.afterClosed.subscribe(() => {
      this.removeDialogComponentFromBody();
      sub.unsubscribe();
    });

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const componentRef = componentFactory.create(new DialogInjector(this.injector, map));

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    this.dialogComponentRef.instance.onClose.subscribe(() => {
      const name = this.dialogComponentRef.constructor.name;
      this.removeDialogComponentFromBody();
    });

    return dialogRef;
  }

  private removeDialogComponentFromBody() {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
    
    this.openComponentList = this.openComponentList.filter(x=>!(x.componentName === this.dialogComponentRef.instance.childComponentType.name));
  }
}


class OpenDialogDetail {
  componentName: string;
  componentDialogRef: DialogRef;
}
