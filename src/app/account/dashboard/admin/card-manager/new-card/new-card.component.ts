import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { CardService } from '../../../../../services/card.service';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.css'],
})
export class NewCardComponent implements OnInit {

  public card = {};
  public successMessage = '';

  constructor(
    private authService: AuthService,
    private cardService: CardService
  ) {
    this.authService.checkAdmin();
  }

  ngOnInit() {
  }

  createCard() {
    this.cardService.createCard(this.card).subscribe(data => {
      this.successMessage = 'Card was successfuly added';
      this.card = {};
    });
  }

  checkStatus() {
    if (this.card['rfid'] && this.card['name']) {
      return false;
    } else { return true; }
  }
}
