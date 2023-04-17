import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  datos = {};

  constructor(private router: Router,
    private productoServicio : ProductoService) { }

  ngOnInit(): void {
  }

  comprobarUsuario(){
    if(localStorage.getItem('usuario')){
      //console.log("Ya se ha iniciado sesión");
      Swal.fire(
        '',
        'Ya se tiene una sesión activa',
        'warning',
      );
      this.router.navigate(['inicio']);
    }
  }

}
