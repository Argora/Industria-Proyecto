import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  allProductos = [];
  userId : number;
  user = false;

  constructor(
    private usuarioServicio : UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.pruebaToken();
  }

  getFavoritos(){
    this.usuarioServicio.getFavoritos(this.userId).subscribe(data=>{
      if(data.exito){
        console.log(data.mensaje);
        this.allProductos = data.productos;
        this.convertirImagenes();
      }else{
        console.log(data.mensaje);
      }
    }, err => console.log(err));
  }

  detallesProducto(id : number){
    this.router.navigate([`productos/detalles/`+id]);
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
        this.user = true;
        this.userId = data.data.data.id;
        this.getFavoritos();
        //console.log(this.user)
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      }
    })
  }

}
