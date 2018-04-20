import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class ProfileService {

  constructor(private authHttp: AuthHttp) { }

  showProfile(profileId) {
    return this.authHttp.get(environment.apiUrl + 'api/v1/users/profiles/' + profileId );
  }

  updateProfile(data) {
    return this.authHttp.patch(environment.apiUrl + 'api/v1/users/profiles', data);
  }

}
