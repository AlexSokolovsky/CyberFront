import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { CardService } from '../../../../services/card.service';

@Component({
  selector: 'app-card-manager',
  templateUrl: './card-manager.component.html',
  styleUrls: ['./card-manager.component.css'],
})
export class CardManagerComponent implements OnInit {
  @Input() users_online: any;
  @Input() cards: any;

  public selectedUserId = '';
  public selectedCardId = '';
  public successMessage = '';

  constructor(
    private authService: AuthService,
    private cardService: CardService
  ) {
    this.authService.checkAdmin();
  }

  ngOnInit() {
  }

  associateCard() {
    const card = {
      id: this.selectedCardId,
      user_id: this.selectedUserId
    };
    this.cardService.associateCard(card).subscribe(data => {
      const return_card = data.json();
      this.successMessage = 'Card  ' + return_card.name + ' was added to ' + return_card.user.email;
    });
  }

  destroyAssociates() {
    this.cardService.destroyAssociates().subscribe(data => {
      this.successMessage = 'All associates are destroyed';
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    });
  }

  checkAssoc() {
    if (this.selectedUserId && this.selectedCardId) {
      return false;
    } else { return true; }
  }

}
