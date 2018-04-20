import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../../services/profile.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  modalRef: BsModalRef;

  public currentUser = JSON.parse(localStorage.getItem('current_user'));
  public profileData = {};
  public fields = [];
  public profileId;
  public avatarUrl;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.profileId = params['id'];
      this.profileService.showProfile(params['id']).subscribe(data => {
        this.profileData = data.json();
        if (this.profileData['image']['url']) {
          this.avatarUrl = environment.apiUrl + this.profileData['image']['url'].slice(1);
        }
        const exludeFields = ['id', 'image'];
        this.fields = Object.keys(this.profileData).filter(key => !exludeFields.includes(key));
      });
    });
  }

  keyFormater(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
  }

  editProfileWindow (template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  updateProfile() {
    const sendData = Object.assign({}, this.profileData);
    const avt = document.getElementById('main_avatar');

    delete sendData['id'];
    if (this.checkLoadImg(avt['src'])) {
      sendData['image'] = localStorage.getItem('imageBase64');
    }
    this.profileService.updateProfile(sendData).subscribe(profile => {
      this.profileData = profile.json();
      this.modalRef.hide();
      if (this.profileData['image']['url']) {
        avt['src'] = localStorage.getItem('imageBase64');
      }
    });
  }

  checkLoadImg(origin) {
    if (localStorage.getItem('imageBase64') !== origin) {
      return true;
    } else { return false; }
  }

  checkAccess() {
    const userProfId = parseInt(this.currentUser['profile']['id'], 10);
    const profId = parseInt(this.profileId, 10);

    if (userProfId === profId) {
      return true;
    } else { return false; }
  }

  load(avt) {
    const avatar = avt['files'][0];
    const reader = new FileReader();

    reader.onloadend = function () { localStorage.setItem('imageBase64', this.result); };

    if (avatar) {  reader.readAsDataURL(avatar); }
  }
}
