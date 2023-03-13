import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
import { ProductoService } from 'src/app/services/producto.service';

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

  constructor(private productoServicio : ProductoService, private router : Router) { }

  ngOnInit(): void {
    this.getProductos();
  }

  allCategorias = [];

  allProductos = [
    {
      id : '',
      nombre : '',
      descripcion : '',
      precio: '',
      imagen: '',
      ImagenTipo: ""
    }
  ];
  getProductos(){
    this.productoServicio.getProductos().subscribe(data => {

      if (data.exito) {
        console.log(data);
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
      let buff = new Buffer(producto.imagen);
      let stringToBase64 = buff.toString('base64');
      let imagen = 'data:'+producto.ImagenTipo+';base64,'+stringToBase64;
      producto.imagen = imagen;
    });
  }

}
