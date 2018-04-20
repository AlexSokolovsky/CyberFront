import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../../services/wsconnection/websocket.service';
import { WebChannelService } from '../../../../services/wsconnection/web.channel.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css'],
})
export class UserMenuComponent implements OnInit {
  @Input() currentUser: Object;

  constructor(
    private webSocketService: WebSocketService,
    private webChannelService: WebChannelService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  toProfile() {
    this.router.navigate(['profile/' + this.currentUser['profile']['id']]);
  }

}
