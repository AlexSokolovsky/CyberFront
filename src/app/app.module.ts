import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { NgModule } from '@angular/core';
import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './modules/routing/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AceEditorModule } from 'ng2-ace-editor';
import { WebSocketService } from './services/wsconnection/websocket.service';
import { ChannelWebsocketService } from './services/wsconnection/channel.websocket.service';
import { WebChannelService } from './services/wsconnection/web.channel.service';
import { StatsChannelService } from './services/wsconnection/stats.channel.service';
import { ProfileService } from './services/profile.service';

import { AppComponent } from './app.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { HomeComponent } from './home/home.component';

import { CodeService } from './services/code.service';
import { CardService } from './services/card.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { AdminComponent } from './account/dashboard/admin/admin.component';
import { UserComponent } from './account/dashboard/user/user.component';
import { CardManagerComponent } from './account/dashboard/admin/card-manager/card-manager.component';
import { NewCardComponent } from './account/dashboard/admin/card-manager/new-card/new-card.component';
import { ProfileComponent } from './account/dashboard/user/profile/profile.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UserMenuComponent } from './account/dashboard/user/user-menu/user-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    RegistrationComponent,
    HomeComponent,
    AdminComponent,
    UserComponent,
    CardManagerComponent,
    NewCardComponent,
    ProfileComponent,
    UserMenuComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToasterModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    AceEditorModule,
    TabsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [
    AuthGuardService,
    AuthService,
    CodeService,
    CardService,
    WebSocketService,
    StatsChannelService,
    ChannelWebsocketService,
    WebChannelService,
    ProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
