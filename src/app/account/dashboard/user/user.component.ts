import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { WebChannelService } from '../../../services/wsconnection/web.channel.service';
import { WebSocketService } from '../../../services/wsconnection/websocket.service';
import { environment } from '../../../../environments/environment';
import { AceEditorModule } from 'ng2-ace-editor';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { CodeService } from '../../../services/code.service';

import { ToasterService } from 'angular2-toaster';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ ToasterService ],
})
export class UserComponent implements OnInit {
  modalRef: BsModalRef;

  // User
  public currentUser = {};

  // Connect
  public appConnected = false;
  public checkConnect = false;
  public connectionState = {
    connectLoading: false,
    connectBtnStatus: true
  };
  public intervalId;

  // Snippets
  public snippetTitle = '';
  public text = '';
  public options: any = {maxLines: 30, printMargin: false};
  public userSnippets = [];
  public selectedSnippet = {};
  public postSnippetsErrors = [];
  public runCodeButtonStatus = true;
  public inspectorStatus = false;


  // Appliance
  public store = { args: {}, default: {} };
  public messages = [];
  public app_state = { available_pins: '', input_pins: '' };
  public result;
  public loopStart: Boolean;

  constructor(
    private authService: AuthService,
    private webChannelService: WebChannelService,
    private webSocketService: WebSocketService,
    private router: Router,
    private modalService: BsModalService,
    private codeService: CodeService,
    private toasterService: ToasterService
  ) {
    this.authService.checkAndRedirect(localStorage.getItem('token'));
  }

  ngOnInit() {
    if (localStorage.getItem('defaultStore')) {
      this.store.default = JSON.parse(localStorage.getItem('defaultStore'));
    }
    this.authService.showUser().subscribe(user => {
      this.currentUser = user.json();
      localStorage.setItem('current_user', JSON.stringify(this.currentUser));
    });
    const jwt = localStorage.getItem('token');
    this.webSocketService.start(environment.socketUrl + 'cable?token=' + jwt);
    this.webChannelService.subscribed.subscribe();
    this.getData();
  }

  getData() {
    this.webChannelService.observableData.subscribe(data => {
      const message = {
        time: new Date(Date.now()).toString().slice(16, 24),
        message: JSON.stringify(data)
      };
      this.messages.unshift(message);
      this.messages.splice(10);
      if (!Object.keys(data).includes('error')) {
        this.appConnected = true;
        this.connectionState.connectLoading = false;
        Object.keys(data).map(data_key => {
          switch (data_key) {
            case 'argv':
              if (this.loopStart) {
                Object.keys(JSON.parse(data['argv'])).map(key => { this.store.args[key] = JSON.parse(data['argv'])[key]; });
                this.getResult();
              } else { this.doNothing(); }
              break;
            case 'app_state':
              Object.keys(JSON.parse(data['app_state'])).map(key => { this.app_state[key] = JSON.parse(data['app_state'])[key]; });
              break;
          }
        });
      }
    });
  }

  openModalWithProfile(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  sendMessage() {
    this.webChannelService.send({ data: this.text});
  }

  checkApplianceStatus() {
    this.connectionState.connectLoading = true;
    this.connectionState.connectBtnStatus = false;
    this.checkConnect = true;
    if (this.checkConnect) {
      this.intervalId = setInterval(() => {
        if (!this.appConnected) {
          this.webChannelService.send({ data: 'connected?'});
        }
      }, 3000);
    }
  }

  stopCheckConnect() {
    this.switchCheckConnect();
    this.checkConnect = false;
    clearInterval(this.intervalId);
  }

  runCode() {
    this.runCodeButtonStatus = !this.runCodeButtonStatus;
    this.loopStart = true;
    new Promise((resolve, reject) => {
      this.webChannelService.observableData.subscribe(data => {
        data['argv'] ? resolve() : reject();
      });
    }).then( () => {
      this.getResult();
    }).catch(() => {
      this.loopStart = false;
      console.log('err');
    });
  }

  getResult() {
    try {
      const start = new Function('store', this.text);
      this.result = start(this.store);
      this.webChannelService.send({ data: this.result});
    } catch (e) {
      console.log(e);
      this.doNothing();
    }
  }

  stopCode() {
    this.loopStart = false;
    this.runCodeButtonStatus = !this.runCodeButtonStatus;
  }

  doNothing() {
    this.webChannelService.send({ data: 'doNothing'});
  }

  logOut() {
    this.webSocketService.close();
    this.webChannelService.unsubscribe();
    this.authService.logOut();
  }

  callArgs() {
    this.webChannelService.send({ data: 'getArgs'});
  }

  defaultStoreKeys() {
    return Object.keys(this.store.default);
  }

  showTypeOfValue(value) {
    return Array.isArray(value) ? 'array' : typeof value;
  }

  addKeyValue(key, value) {
    if (key.value && value.value) {
      this.store.default[key.value] = this.checkTypeAndReturnValue(value.value);
      localStorage.setItem('defaultStore', JSON.stringify(this.store.default));
      key.value = '';
      value.value = '';
    }

  }

  checkTypeAndReturnValue(value) {
    const numberCheck = new RegExp(/[0-9]/);

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.substring(1, value.length - 1);
      return value.split(',').filter(i => i !== '');
    } else if (!Number.isNaN(parseInt(value, 10))) {
      return parseInt(value, 10);
    } else { return value; }
  }

  switchInspector() { this.inspectorStatus = !this.inspectorStatus; }
  switchCheckConnect() {
    this.connectionState.connectLoading = !this.connectionState.connectLoading;
    this.connectionState.connectBtnStatus = !this.connectionState.connectBtnStatus;
  }

  loadSnippets(template: TemplateRef<any>) {
    this.codeService.loadSnippets().subscribe(snippets => {
      this.userSnippets = snippets.json();
      this.modalRef = this.modalService.show(template);
    });
  }

  postSnippet() {
    const body = {
      title: this.snippetTitle,
      code: this.text
    };
    this.codeService.addSnippet(body).subscribe(res => {
      this.snippetTitle = '';
      this.modalRef.hide();
      this.postSnippetsErrors = [];
      this.toasterService.pop('success', 'Snippet was successfully created');
    },
    err => {
      this.postSnippetsErrors = Object.values(err.json());
    });
  }

  updateCode() {
    const body = {
      title: this.selectedSnippet['title'],
      code: this.text
    };

    this.codeService.updateSnippet(this.selectedSnippet['id'], body).subscribe(res => {
      this.toasterService.pop('info', 'Snippet was successfully updated');
    }, err => {
      console.log(err.json());
    });
  }

  deleteSnippet(id) {
    this.codeService.deleteSnippet(id).subscribe(res => {
      this.selectedSnippet = {};
      this.text = '';
      this.toasterService.pop('warning', 'Snippet was successfully deleted');
    });
  }

  saveSnippWindow (template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  selectSnippet(snippet) {
    this.modalRef.hide();
    this.selectedSnippet = snippet;
    this.text = snippet.code;
    this.toasterService.pop('info', 'Snippet was successfully selected');
  }

  checkSnippet(snippet) {
    return Object.keys(snippet).length > 0;
  }
}
