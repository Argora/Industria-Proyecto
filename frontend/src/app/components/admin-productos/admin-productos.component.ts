import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export class AdminProductosComponent implements OnInit {

  Usuario : number;
  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    categorias: new FormControl('', Validators.required),
  });
  closeResult = '';
  categoria = new FormControl();
  allProductos = [];
  allCategorias = [];
  producto = {}

  constructor(
    private adminServicio : AdminService,
    private usuarioServicio : UsuarioService,
    private productoServicio : ProductoService,
    private modalService: NgbModal,
    private router : Router) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.getCategorias();
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

  cargarProducto(producto : any){
    this.formulario.setValue({
      nombre:producto.nombre,
      precio:producto.precio,
      descripcion:producto.descripcion,
      categorias:producto.categoria
    })
  }
  
  validar() {
    var product = this.formulario.value;
    this.producto = {
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.descripcion,
      categoria: product.categorias,
      usuarioId: this.Usuario
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


  getProductos(){
    this.adminServicio.getProductosAdmin().subscribe(data => {

      if (data.exito) {
        console.log(data.mensaje);
        this.allProductos = data.productos;
        this.calcularDías();
        //console.log(this.allProductos);
      }
      else {
        console.log(data.mensaje);
      }

    }, err => console.log(err));
  }

  calcularDías(){
    let currentDate = new Date();
    this.allProductos.forEach((producto)=>{
      let productDate = new Date(producto.creacion);
      let days = currentDate.getTime() - productDate.getTime();
      days = Math.round(days/(1000*60*60*24));
      producto.actualizacion = days;
    });
  }

  getCategorias() {

    this.productoServicio.getDatosRegistroProducto().subscribe(data => {

      if (data.exito) {
        console.log(data);
        this.allCategorias = data.categorias;
      }
      else {
        console.log(data.mensaje);
      }

    }, err => console.log(err));
  }


  actualizarProducto(){

  }

  registrarProducto(){};

  eliminarProducto(producto : any){
    Swal.fire({
      title: '',
      text: "Se eliminara el producto: "+producto.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Inhabilitando producto: '+producto.Id);
        this.productoServicio.eliminarProducto(producto.Id).subscribe(data => {

          if (data.exito) {
            this.getProductos();
            console.log(data.mensaje);
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

  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  pruebaToken(){
    this.usuarioServicio.postToken({token:localStorage.getItem('token')}).subscribe(data => {
      //console.log(localStorage.getItem('token'))
      if (data.exito) {
        console.log(data.mensaje);
        this.Usuario = data.data.data.id;
        this.getProductos();
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      }
    })
  }

}
