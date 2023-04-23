import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
    categorias: new FormControl(),
  });

  id: number = 0;
  userId : number;
  user = false;

  constructor(
    private productoServicio : ProductoService, 
    private router : Router,
    private usuarioServicio : UsuarioService) { }

  ngOnInit(): void {
    this.pruebaToken();
  }

  allCategorias = [];

  allProductos = [];

  getCategorias() {
    this.productoServicio.getDatosRegistroProducto().subscribe(data => {
      if (data.exito) {
        console.log(data.mensaje);
        this.allCategorias = data.categorias;
        this.getProductos();
      }
      else {
        console.log(data.mensaje);
      }

    }, err => console.log(err));
  }


  cargarProductos(){
    let id = this.formulario.value.categorias;
    if(id == 0){
      this.getProductos();
    }else{
      this.filtrarProductos(id);
    }
  }

  getProductos(){
    this.productoServicio.getProductos().subscribe(data => {
      if (data.exito) {
        console.log(data.mensaje);
        this.allProductos = data.productos;
        this.limpiarProductos();
        this.convertirImagenes();
      }
      else {
        console.log(data.mensaje);
      }
    }, err => console.log(err));
  }

  limpiarProductos(){
    //console.log('limpiar')
    //console.log(this.user)
    if(this.user){
      var indices = [];
      var usuario = this.userId;
      this.allProductos.forEach((producto, index) =>{
        if(producto.personaId==usuario){
          indices.push(index);
        }
      });
      for(var i = indices.length-1;i>=0;i--){
        this.allProductos.splice(indices[i], 1);
      }
    }
  }

  filtrarProductos(categoria : number){
    console.log('Productos de categoria: '+categoria);
    this.productoServicio.getProductosCategoria(categoria).subscribe(data => {
      if (data.exito) {
        console.log(data.mensaje);
        this.allProductos = data.productos;
        this.limpiarProductos();
        this.convertirImagenes();
      }
      else {
        console.log(data.mensaje);
        this.allProductos=[];
        Swal.fire(
          'Ups!',
          'No hay productos de esa categoría',
          'warning',
        );
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
        this.userId = data.data.data.id;
        this.user = true;
        console.log(data.mensaje);
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        //this.router.navigate(['login']);
      }
    })
    this.getCategorias();
  }

}
