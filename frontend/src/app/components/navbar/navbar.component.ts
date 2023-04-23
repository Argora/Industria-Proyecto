import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  sesion = false;
  admin = false;
  user = false;

  isMenuCollapsed = true;

  constructor(
    private router : Router,
    private usuarioServicio : UsuarioService) { }

  ngOnInit(): void {
    //conprobar usuario al cargar navbar por primera vez
    this.pruebaSesion();
    //comprobar usuario cuando se haga un cambio en la url
    this.router.events.subscribe((data:any)=>{
      if(data.url){
        //console.log('actualizando navbar');
        this.pruebaSesion();
      }
    });
  }



  pruebaSesion(){
    this.usuarioServicio.postToken({token:localStorage.getItem('token')}).subscribe(data => {
      //console.log(localStorage.getItem('token'))
      if (data.exito) {
        //console.log(data.mensaje);
        if(data.data.data.id){
          //console.log('usuario reconocido')
          this.sesion = true;
          if(data.data.data.tipoUsuario==1){
            //console.log('usuario normal')
            this.admin = false;
            this.user = true;
          }else{
            //console.log('usuario admin');
            this.admin = true;
            this.user = false;
          }
        }
      }
      else {
        //console.log(data.mensaje);
        this.sesion = false;
        this.user = false;
        this.admin = false;
        localStorage.clear();
      }
    })
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
