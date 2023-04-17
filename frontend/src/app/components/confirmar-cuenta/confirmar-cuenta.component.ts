import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-confirmar-cuenta',
  templateUrl: './confirmar-cuenta.component.html',
  styleUrls: ['./confirmar-cuenta.component.css']
})
export class ConfirmarCuentaComponent implements OnInit {

  constructor(
    private usuarioServicio : UsuarioService, 
    private activatedRoute: ActivatedRoute, 
    private router : Router) { }

  ngOnInit(): void {

    this.confirmarUsuario();

  }

  confirmarUsuario(){
    this.activatedRoute.params.subscribe( token =>{
      this.usuarioServicio.postConfirmarCuenta(token).subscribe(result=>{
        console.log(result);
       },err =>console.log(err));
       this.router.navigate(['login']);
    });
  };

}
