import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';

@Injectable()
export class CodeService {

  constructor(private authHttp: AuthHttp) { }

  loadSnippets() {
    return this.authHttp.get(environment.apiUrl + 'api/v1/users/snippets');
  }

  addSnippet(body) {
    return this.authHttp.post(environment.apiUrl + 'api/v1/users/snippets', body);
  }

  updateSnippet(id, body) {
    return this.authHttp.patch(environment.apiUrl + 'api/v1/users/snippets/' + id, body);
  }

  deleteSnippet(id) {
    return this.authHttp.delete(environment.apiUrl + 'api/v1/users/snippets/' + id);
  }

}
