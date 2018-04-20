import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class CardService {

  constructor(private authHttp: AuthHttp, private router: Router) { }

  createCard(card) {
    return this.authHttp.post(environment.apiUrl + 'api/v1/cards', card);
  }

  showAllCards() {
    return this.authHttp.get(environment.apiUrl + 'api/v1/cards');
  }

  associateCard(card) {
    return this.authHttp.put(environment.apiUrl + 'api/v1/cards/' + card.id, card);
  }

  destroyAssociates() {
    return this.authHttp.delete(environment.apiUrl + 'api/v1/associations');
  }
}
