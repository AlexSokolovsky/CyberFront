import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(private authHttp: AuthHttp, private router: Router) { }

  loggedIn() {
    if (localStorage.getItem('token')) {
      return tokenNotExpired();
    }
  }

  signIn(data) {
    return this.authHttp.post(environment.apiUrl + 'api/v1/token', data);
  }

  signUp(data) {
    return this.authHttp.post(environment.apiUrl + 'api/v1/user', data);
  }

  showUser() {
    return this.authHttp.get(environment.apiUrl + 'api/v1/user');
  }

  checkAndRedirect(jwt) {
    localStorage.setItem('token', jwt);

    if (jwt) {
      this.showUser().subscribe(user => {
        const current_user = user.json();
        if (current_user['role'] === 'admin') {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['user']);
        }
      });
    }
  }

  checkAdmin() {
    this.showUser().subscribe(user => {
      const current_user = user.json();
      if (current_user['role'] !== 'admin') {
        this.router.navigate(['user']);
      }
    });
  }

  logOut() {
    ['token', 'current_user', 'imageBase64'].map(key => {
      localStorage.removeItem(key);
    });
    this.router.navigate(['']);
  }
}
