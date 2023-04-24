import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushService } from './services/push.service';
import { UsuarioService } from './services/usuario.service';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hondumarket';

  AllUsuarios = [];
  suscripciones = [];
  Usuario: number;

  public readonly VAPID_PUBLIC_KEY: string = 'BMyCzy-snI3LlMzPmVl5fjtlBibF_fmaQFA0jHGlmcARDnscvPtjNa23YdqvyJuu0ujbnsNaXYKlyUqBQlUUE20';

  constructor(
    private swPush: SwPush,
    private pushService: PushService,
    private usuarioService: UsuarioService,
    private adminService: AdminService
  ) {
    this.getUsuarios();
    // this.subscribeToNotifications();
  }

  subscribeToNotifications(): any {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      const token = JSON.parse(JSON.stringify(sub));
      console.log('***ojo***', token);
    }).catch(err => console.error('error en ', err));
  }

  getUsuarios(){
    this.adminService.getUsuariosAdmin().subscribe(data => {
      if(data.exito){
        console.log(data.mensaje);
        console.log(data);
        //data.usuarios contiene todos los usuarios registrados
        //console.log(data.usuarios);
        this.AllUsuarios = data.usuarios;
        //console.log(this.AllUsuarios)
        this.AllUsuarios.forEach((user) => {
          console.log(user.Id);
          this.getSubscripciones(user.Id);
        });
        
      }else{
        console.log(data.mensaje);      
      }
    })
  }

  getSubscripciones(id: number) {

    this.usuarioService.getSubscripciones(id).subscribe(data => {

      if (data.exito) {
        console.log(data);
        this.suscripciones = data.suscripciones;
        console.log(this.suscripciones);
      }
      else {
        console.log(data.mensaje);
        this.suscripciones = [];
      }

    }, err => console.log(err));
  }
}
