import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registrar-producto',
  templateUrl: './registrar-producto.component.html',
  styleUrls: ['./registrar-producto.component.css']
})
export class RegistrarProductoComponent implements OnInit {
  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    categorias: new FormControl('', Validators.required),
  });

  idUsuario : number;

  constructor(
    private location: Location,
    private productoServicio : ProductoService,
    private usuarioServicio : UsuarioService, 
    private router : Router) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.getDatosRegistroProducto();
  }
  files = [];
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  producto = {}

  validar() {
    var product = this.formulario.value;
    this.producto = {
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.descripcion,
      categoria: product.categorias,
      usuarioId: this.idUsuario
    }
    console.log(this.producto);
    if (!this.formulario.valid || !this.files.length) {
      Swal.fire(
        'ERROR!',
        'Porfavor completar todos los campos',
        'warning',
      );
    }else if(this.files.length>4){
      Swal.fire(
        'ERROR!',
        'solo se permiten máximo 4 imágenes',
        'warning',
      );
    } else {
      const formData = new FormData();

      for (let img of this.files) {

        formData.append('imagenesProducto', img);
      }
      this.productoServicio.postInsertNewProducto({ producto: this.producto }, 0).subscribe(result => {
        if (result.exito) {
          this.productoServicio.postInsertNewProducto(formData, result.productoId).subscribe(result => {

            if (result.exito) {
              Swal.fire(
                'EXITO!',
                result.mensaje,
                'success',
              );

            } else {
              Swal.fire(
                'ERROR!',
                result.mensaje,
                'warning',
              );
            }


          });
        } else {
          Swal.fire(
            'ERROR!',
            result.mensaje,
            'warning',
          );

        }
      });
      this.formulario.reset();
    // this.files.pop();
    while (this.files.length) {
      this.files.pop();
    }

    }
    


  }

  //Datos registro Producto
  allCategorias = [];


  getDatosRegistroProducto() {

    this.productoServicio.getDatosRegistroProducto().subscribe(data => {

      if (data.exito) {
        console.log(data.mensaje);
        this.allCategorias = data.categorias;
      }
      else {
        console.log(data.mensaje);
      }

    }, err => console.log(err));
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
