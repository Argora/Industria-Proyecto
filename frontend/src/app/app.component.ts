import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hondumarket';

  public readonly VAPID_PUBLIC_KEY:string = 'BMyCzy-snI3LlMzPmVl5fjtlBibF_fmaQFA0jHGlmcARDnscvPtjNa23YdqvyJuu0ujbnsNaXYKlyUqBQlUUE20';

  constructor(private swPush: SwPush, private pushService: PushService) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications(): any {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then( sub => {
      const token = JSON.parse(JSON.stringify(sub));
      console.log('***ojo***', token);
    }).catch(err => console.error('error en ', err));
  }
}
