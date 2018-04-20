import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CardService } from '../../../services/card.service';
import { StatsChannelService } from '../../../services/wsconnection/stats.channel.service';
import { WebSocketService } from '../../../services/wsconnection/websocket.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  public current_user = {};
  public users_online = [];
  public cards = [];
  public new_user = { id: '', email: ''};

  constructor(
    private router: Router,
    private authService: AuthService,
    private statsChannelService: StatsChannelService,
    private webSocketService: WebSocketService,
    private cardService: CardService

  ) {
    this.authService.checkAndRedirect(localStorage.getItem('token'));
  }

  ngOnInit() {
    const jwt = localStorage.getItem('token');
    this.webSocketService.start(environment.socketUrl + 'cable?token=' + jwt);
    this.statsChannelService.subscribed.subscribe();
    this.statsChannelService.observableData.subscribe(data => {
      if (data['users_online']) {
        data['users_online'].map(user => {
          this.new_user.email = user[1];
          this.new_user.id = user[0];
          this.users_online.push(this.new_user);
          this.new_user = { id: '', email: ''};
        });
      } else if (data['action'] === 'unsubscribed') {
        this.deleteUserFromList(data['user']);
      } else if (data['action'] === 'subscribed') {
        this.addUserToList(data['user']);
      }
    });

    this.cardService.showAllCards().subscribe(cards => this.cards = cards.json());
  }

  addUserToList(user) {
    if (this.users_online.length > 0) {
      let ids = [];
      new Promise((resolve, reject) => {
        ids = this.users_online.map(c_user => c_user.id);
        if (ids.length > 0) { resolve(); }
      }).then(() => {
        if (!ids.includes(user.id)) { this.users_online.push(user); }
      });
    } else {
      this.users_online.push(user);
    }
  }

  deleteUserFromList(user) {
    this.users_online = this.users_online.filter(check_user => check_user.id !== user.id);
  }

  logOut() {
    this.statsChannelService.unsubscribe();
    this.webSocketService.close();
    this.authService.logOut();
  }

}
