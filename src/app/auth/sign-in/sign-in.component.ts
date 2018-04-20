import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public user = { email: '', password: ''};
  public errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['home']);
    }
  }

  signIn() {
    const data = { auth: this.user };

    this.authService.signIn(data).subscribe(
      token => {
        const jwt = JSON.parse(token['_body']).jwt;
        this.authService.checkAndRedirect(jwt);
        this.errorMessage = '';
      }, err => {
        this.errorMessage = 'Invalid email or password';
      });
  }
}
