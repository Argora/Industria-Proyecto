import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Buffer } from 'buffer';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  formulario = new FormGroup({
    categorias: new FormControl(''),
  });

  id: number = 0;

  constructor(
    private productoServicio : ProductoService, 
    private router : Router,
    private usuarioServicio : UsuarioService) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.getProductos();
  }

  allCategorias = [];

  allProductos = [];
  getProductos(){
    this.productoServicio.getProductos().subscribe(data => {

      if (data.exito) {
        console.log(data.mensaje);
        this.allProductos = data.productos;
        this.convertirImagenes();
      }
      else {
        console.log(data.mensaje);
      }

    }, err => console.log(err));
  }

  convertirImagenes(){
    this.allProductos.forEach(producto=>{
      let buff = new Buffer(producto.Imagen);
      let stringToBase64 = buff.toString('base64');
      let imagen = 'data:'+producto.ImagenTipo+';base64,'+stringToBase64;
      producto.Imagen = imagen;
    });
  }

  pruebaToken(){
    this.usuarioServicio.postToken({token:localStorage.getItem('token')}).subscribe(data => {
      //console.log(localStorage.getItem('token'))
      if (data.exito) {
        console.log(data.mensaje);
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        //this.router.navigate(['login']);
      }
    })
  }

}
