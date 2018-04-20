import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authservice.loggedIn()) {
      this.authservice.checkAndRedirect(localStorage.getItem('token'));
    }
  }

  navigateTo(path) {
    this.router.navigate([path]);
  }
}
