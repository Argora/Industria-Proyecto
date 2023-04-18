import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-productos',
  templateUrl: './mis-productos.component.html',
  styleUrls: ['./mis-productos.component.css']
})
export class MisProductosComponent implements OnInit {

  idUsuario : number;
  allProductos = [];

  constructor(
    private usuarioServicio : UsuarioService,
    private productoServicio : ProductoService,
    private router : Router) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.getProductosUsuario();
  }

  getProductosUsuario(){
    this.productoServicio.getProductosUsuario(this.idUsuario).subscribe(data => {

      if (data.exito) {
        console.log(data.mensaje);
        this.allProductos = data.productos;
        this.convertirImagenes();
        console.log(this.allProductos);
      }
      else {
        console.log(data.mensaje);
        this.allProductos = [];
      }

    }, err => console.log(err));
  }

  eliminarProducto(producto : any){
    Swal.fire({
      title: 'Estas seguro?',
      text: "Se eliminara el producto: "+producto.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Inhabilitando producto: '+producto.Id);
        this.productoServicio.inhabilitarProducto(producto.Id).subscribe(data => {

          if (data.exito) {
            console.log(data.mensaje);
            this.getProductosUsuario();
            Swal.fire(
              'Producto eliminado',
              '',
              'success',
            );
          }
          else {
            console.log(data.mensaje);
          }

        }, err => console.log(err));
      }
    })
    
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
        this.idUsuario = data.data.data.id;
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      }
    })
  }

}
