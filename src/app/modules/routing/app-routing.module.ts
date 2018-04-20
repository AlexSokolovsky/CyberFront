import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../home/home.component';

import { AuthGuardService } from '../../services/auth-guard.service';

import { SignInComponent } from '../../auth/sign-in/sign-in.component';
import { RegistrationComponent } from '../../auth/registration/registration.component';
import { AdminComponent } from '../../account/dashboard/admin/admin.component';
import { CardManagerComponent } from '../../account/dashboard/admin/card-manager/card-manager.component';
import { NewCardComponent } from '../../account/dashboard/admin/card-manager/new-card/new-card.component';
import { UserComponent } from '../../account/dashboard/user/user.component';
import { ProfileComponent } from '../../account/dashboard/user/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: RegistrationComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
  { path: 'card-manager', component: CardManagerComponent, canActivate: [AuthGuardService] },
  { path: 'new-card', component: NewCardComponent, canActivate: [AuthGuardService] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: '**', component: HomeComponent }

];

@NgModule ({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
