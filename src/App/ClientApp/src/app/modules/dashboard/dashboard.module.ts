import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@partie/shared/shared.module';

import { DashboardComponent } from '@partie/dashboard/components/dashboard.component';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DashboardModule { }
