import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class WebSocketService {

  private ws: WebSocketSubject<Object>;
  private socket: Subscription;
  private url: string;

  public message = new Subject();
  public opened = new Subject();

  public close(): void {
    this.socket.unsubscribe();
    this.ws.complete();
  }

  public sendMessage( message: string ): void {
    this.ws.next( message );
  }

  public start( url: string ): void {
    const self = this;

    this.url = url;

    this.ws = Observable.webSocket( this.url );

    this.socket = this.ws.subscribe( {

      next: ( data: MessageEvent ) => {
        if ( data[ 'type' ] === 'welcome' ) {
          self.opened.next( true );
        }
        this.message.next( data );
      },
      error: () => {

        self.opened.next( false );
        this.message.next( { type: 'closed' } );

        self.socket.unsubscribe();

        setTimeout( () => {
          self.start( self.url );
        }, 1000 );

      },
      complete: () => {
        this.message.next( { type: 'closed' } );
      }
    });
  }
}
