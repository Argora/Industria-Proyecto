import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  Usuario: number;
  calificacion = 0;
  opiniones = 0;
  allCategorias = [];
  categoria = new FormControl();
  suscripciones = [];
  usuario = {
    nombre: '',
    apellido: '',
    departamento: '',
    email: '',
    telefono: '',
    diasRestantes:''
  }
  plan : number;
  closeResult = '';

  constructor(
    private usuarioServicio : UsuarioService,
    private productoServicio : ProductoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.getCategorias();
    this.getSubscripciones();
  }

  getPerfilUsuario(id){
    this.usuarioServicio.getPerfilUsuario(id).subscribe(data => {
      if (data.exito) {
        console.log(data.mensaje);
        //data.usuario contiene los datos del usuario actual
        this.usuario = data.usuario
        console.log(this.usuario)
        //si se ejecuta una funcion aqui, this.usuario contiene el id y los dias restantes del usuario actual
      }
      else {
        console.log(data.mensaje);
      }
    }, err => console.log(err));
  }

  subscribirCategoria(){
    console.log(this.categoria.value);
    var datos = {
      clienteId: this.Usuario,
      categoriaId: this.categoria.value
    }
    console.log(datos);
    this.usuarioServicio.postInscribirCategoria(datos).subscribe(data => {
      if (data.exito) {
        Swal.fire(
          ''+data.mensaje,
          '',
          'success',
        );
        this.getSubscripciones();
        console.log(data.mensaje);
      }
      else {
        Swal.fire(
          ''+data.mensaje,
          '',
          'info',
        );
        console.log(data.mensaje);
      }
    }, err => console.log(err));
  }

  cancelarSuscripcion(id : number){
    var datos = {
      clienteId: this.Usuario,
      categoriaId: id
    }

    Swal.fire({
      text: "¿Desea eliminar esta suscripción?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioServicio.postcancelarSuscripcion(datos).subscribe(data => {
          if (data.exito) {
            console.log(data.mensaje);
            this.getSubscripciones();
            Swal.fire(
              'Suscripción cancelada',
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

  getSubscripciones() {

    this.usuarioServicio.getSubscripciones(this.Usuario).subscribe(data => {

      if (data.exito) {
        console.log(data);
        this.suscripciones = data.suscripciones;
      }
      else {
        console.log(data.mensaje);
        this.suscripciones = [];
      }

    }, err => console.log(err));
  }

  getCategorias() {

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
        this.Usuario = data.data.data.id;
        this.getPerfilUsuario(data.data.data.id);
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        //this.router.navigate(['login']);
      }
    })
  }

  setPlan(plan : number){
    this.plan = plan;
  }

  comprarPremium(){
    console.log('comprar paquete '+this.plan);
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

}
