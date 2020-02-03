import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { AccountComponent } from './components/account/account.component';
import { AccountPreferencesComponent } from './components/account-preferences/account-preferences.component';
import { PrivacyAndSafetyComponent } from './components/privacy-and-safety/privacy-and-safety.component';

const routes: Routes = [
  { path: '', component: AccountComponent },
  { path: 'preferences', component: AccountPreferencesComponent },
  { path: 'privacy', component: PrivacyAndSafetyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
