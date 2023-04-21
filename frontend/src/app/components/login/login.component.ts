import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { validarCorreo } from './login.helper'
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  datos = {};

  constructor(private router: Router,
    private usuarioServicio : UsuarioService) { }

  ngOnInit(): void {
    this.crearRegistroForm();
    this.comprobarUsuario();
  }

  crearRegistroForm(): void{
    this.loginForm = new FormGroup({
      email: new FormControl("", Validators.required),
      passw: new FormControl("", Validators.required)
    })
  }

  logIn() {

    var usuario = this.loginForm.value;

    this.datos = {
      email: usuario.email,
      contrasenia: usuario.passw
    };


    if(!this.validar){
      Swal.fire(
        'Error!',
        'Ingrese un email valido',
        'warning',
      );
    }else if(this.loginForm.valid){
      this.usuarioServicio.postLogIn(this.datos).subscribe(data => {
      
        if(data.acceso){
          localStorage.setItem('token', data.token);
          console.log(data);
          if(parseInt(data.usuario.TipoUsuario)==1){
            this.router.navigate(['productos']);
          }
          //enviar a pagina de admin si el tipo de usuario es admin
          else if(parseInt(data.usuario.TipoUsuario)==2){
            this.router.navigate(['adminHome']);
          }
        }else{
          //console.log(data.acceso);
          Swal.fire(
            'Error!',
            data.mensaje,
            'warning',
          );
        }
  
      }, err => console.log(err));
    }else{
      Swal.fire(
        'Error!',
        'Por favor completar todos los datos',
        'warning',
      );
    }

  }

  get validar(){
    return validarCorreo(this.loginForm.get('email').value)
  }

  comprobarUsuario(){
    if(localStorage.getItem('token')){
      //console.log("Ya se ha iniciado sesión");
      Swal.fire(
        '',
        'Ya se tiene una sesión activa',
        'warning',
      );
      this.router.navigate(['productos']);
    }
  }

}
