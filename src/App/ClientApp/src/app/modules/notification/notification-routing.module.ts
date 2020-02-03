import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//Components
import { NotificationListComponent } from '@partie/notification/components/notification-list/notification-list.component'
import { NotificationManagerComponent } from '@partie/notification/components/notification-manager/notification-manager.component'


const routes: Routes = [
  { path: '', component: NotificationListComponent, pathMatch: 'full' },
  { path: 'manager', component: NotificationManagerComponent, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
