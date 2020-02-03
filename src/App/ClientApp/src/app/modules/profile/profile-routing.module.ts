import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { PublicProfileComponent } from '@partie/profile/components/public-profile/public-profile.component';
import { EditProfileComponent } from '@partie/profile/components/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '@partie/profile/components/change-password/change-password.component';




import { RedirectGuard } from '@partie/core/guards/redirect.guard';

const routes: Routes = [
    { path: '', component: PublicProfileComponent },
    { path: 'edit', component: EditProfileComponent, pathMatch: 'full' },
    { path: 'change', component: ChangePasswordComponent },
    { path: ':id', component: PublicProfileComponent },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
