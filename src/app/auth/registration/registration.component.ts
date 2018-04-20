import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public user = { email: '', password: ''};

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['home']);
    }
  }

  signUp() {
    const user = { user: this.user };

    this.authService.signUp(user).subscribe(data => {
      const auth = { auth: this.user };
      this.authService.signIn(auth).subscribe(token => {
        const jwt = JSON.parse(token['_body']).jwt;
        this.authService.checkAndRedirect(jwt);
      });
    });
  }
}
