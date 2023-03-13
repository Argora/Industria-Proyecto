import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Buffer } from 'buffer';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-detalles-producto',
  templateUrl: './detalles-producto.component.html',
  styleUrls: ['./detalles-producto.component.css']
})
export class DetallesProductoComponent implements OnInit {
  
  calificacion = new FormGroup({
    estrella1: new FormControl('1'),
    estrella2: new FormControl('2'),
    estrella3: new FormControl('3'),
    estrella4: new FormControl('4'),
    estrella5: new FormControl('5'),
  });
  id: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoServicio : ProductoService
    ) { }

  ngOnInit(): void {
    this.obtenerIdProducto();
  }

  producto = {
    Id: 0,
    nombre: '',
    precio: 0,
    descripcion: '',
    Categoria: '',
    actualizacion: '',
    Usuario: '',
    UsuarioId: 0
  };

  imagenesProducto = [];

  obtenerIdProducto() {
    this.id = +this.route.snapshot.paramMap.get('id');
    console.log('Detalles de producto: ' + this.id);
    this.obtenerProductoDetalle(this.id);
  }

  obtenerProductoDetalle(id: number) {
    this.productoServicio.getProductoDetalle(id).subscribe(
      (data) => {
        if (data.exito) {
          console.log(data);
          this.producto = data.producto[0];
          this.imagenesProducto = data.imagenes;
          this.convertirImagenes();
        } else {
          console.log(data.mensaje);
        }
      },
      (err) => console.log(err)
    );
  }

  convertirImagenes() {
    this.imagenesProducto.forEach((imagen) => {
      let buff = new Buffer(imagen.Imagen);
      let stringToBase64 = buff.toString('base64');
      let img = 'data:' + imagen.ImagenTipo + ';base64,' + stringToBase64;
      imagen.Imagen = img;
    });
  }



}
