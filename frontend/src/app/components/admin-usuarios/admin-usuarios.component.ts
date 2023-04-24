import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/services/admin.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { correoValido, passValido, passwordMatchValidator } from './registro.helper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  registroForm: FormGroup;
  actualizacionForm : FormGroup
  Usuario : number;
  userId : number;
  AllUsuarios = [];
  closeResult = '';
  usuario = {};
  usuarioActualizacion = {};

  //datos de registro
  departamentos = [];
  municipios = [];
  municipiosActualizacion = [];

  constructor(
    private adminServicio : AdminService,
    private usuarioServicio : UsuarioService,
    private modalService: NgbModal,
    private router : Router) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.crearRegistroForm();
    this.crearActualizacionForm();
  }

  getUsuarios(){
    this.adminServicio.getUsuariosAdmin().subscribe(data => {
      if(data.exito){
        console.log(data.mensaje);
        this.AllUsuarios = data.usuarios;
        //console.log(this.AllUsuarios)
      }else{
        console.log(data.mensaje);      
      }
    })
  }

  getDatosRegistro() {
    //Obtener lista de minicipios y departamentos
    this.usuarioServicio.getDatosMunicipios().subscribe(data => {
      this.departamentos = data.departamentos;
      this.municipios = data.municipios;
    }, err => console.log(err));
  }

  get filtrarMunicipios() {
    //Mostrar lista de municipios pertenecientes al departamento seleccionado
    var municipio = this.municipios.filter(e => {
      return e.departamentoId == this.registroForm.get('departamento').value;
    });

    return municipio;
  }

  filtrarMunicipiosActualizacion(){
    this.municipiosActualizacion = this.municipios.filter(r => {
      return r.departamentoId == this.actualizacionForm.get('departamento').value
    });
  }

  eliminarUsuario(usuario : any){
    //console.log(usuario);
    //Advertencia
    Swal.fire({
      title: '',
      text: "Se eliminara el usuario: "+usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Borrando usuario: '+usuario.Id);
        this.adminServicio.eliminarUsuario(usuario.Id).subscribe(data => {
          if (data.exito) {
            //Recargar lista de usuarios
            this.getUsuarios();
            console.log(data.mensaje);
            Swal.fire(
              'Usuario eliminado',
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

  cargarUsuario(usuario : any){
    console.log(usuario);
    this.actualizacionForm.get('nombre').setValue(usuario.nombre);
    this.actualizacionForm.get('apellido').setValue(usuario.apellido);
    this.actualizacionForm.get('email').setValue(usuario.email);
    this.actualizacionForm.get('departamento').setValue(usuario.departamentoId);
    this.filtrarMunicipiosActualizacion();
    this.actualizacionForm.get('municipio').setValue(usuario.municipioId);
    this.actualizacionForm.get('telefono').setValue(usuario.telefono);
    this.actualizacionForm.get('direccion').setValue(usuario.direccion);
    this.userId = usuario.Id;
  }

  actualizarUsuario(){
        //Tomando los valores que se encuentran en el formulario
        var usuario = this.actualizacionForm.value;
        //guardando los valores en variable local
        this.usuarioActualizacion = {
          id:this.userId,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          municipio: usuario.municipio,
          departamento: usuario.departamento,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          suscripcion: usuario.suscripcion
        };
        //Validando contraseñas y correo
        if (this.actualizacionForm.valid && this.validarCorreoActualizacion) {
          //actualizando producto con los nuevos parametros
          console.log(this.usuarioActualizacion)
          this.adminServicio.actualizarUsuarioAdmin(this.usuarioActualizacion).subscribe(result =>{
            if (result.exito) {
              Swal.fire(
                'EXITO!',
                result.mensaje,
                'success',
              );
              this.getUsuarios();
            } else {
              Swal.fire(
                'ERROR!',
                result.mensaje,
                'warning',
              );
            } 
          });
        }else {
          Swal.fire(
            'Error!',
            'Por favor completar el registro con todo los datos',
            'warning',
          );
        }
    
  }

  crearRegistroForm(): void {
    //Inicializando formulario de registro para nuevo usuario
    //tambien se llama a esta funcion para resetear los valores del formulario
    this.registroForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      apellido: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      passw: new FormControl("", Validators.required),
      municipio: new FormControl("", Validators.required),
      departamento: new FormControl("", Validators.required),
      telefono: new FormControl("", Validators.required),
      direccion: new FormControl("", Validators.required),
      passw2: new FormControl("", Validators.required),
      termino: new FormControl(true),
      suscripcion: new FormControl("", Validators.required)
    }, passwordMatchValidator)
  }

  crearActualizacionForm(): void {
    //Inicializando formulario de actualización de usuario
    this.actualizacionForm = new FormGroup({
      nombre: new FormControl("", Validators.required),
      apellido: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      municipio: new FormControl("", Validators.required),
      departamento: new FormControl("", Validators.required),
      telefono: new FormControl("", Validators.required),
      direccion: new FormControl("", Validators.required),
      suscripcion: new FormControl("", Validators.required)
    })
  }

  registrarUsuario() {
    //Tomando los valores que se encuentran en el formulario
    var usuario = this.registroForm.value;
    //guardando los valores en variable local
    this.usuario = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      passw: usuario.passw,
      municipio: usuario.municipio,
      departamento: usuario.departamento,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      suscripcion: usuario.suscripcion
    };
    //Validando contraseñas y correo
    if (this.registroForm.valid && this.validarCorreo && this.validarPass) {
      //console.log(this.usuario)
      //Solicitud para registrar nuevo usuario en backend
      this.adminServicio.postRegistrarUsuarioAdmin(this.usuario).subscribe(result => {
        if (result.guardado) {
          console.log(result.mensaje);
          Swal.fire({
            title: 'Usuario registrado',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.getUsuarios();
            }
          });
        } else {
          console.log(result.mensaje);
          Swal.fire(
            'Error!',
            result.mensaje,
            'warning',
          );
        }
      }, err => console.log(err));
    } else {
      Swal.fire(
        'Error!',
        'Por favor completar el registro con todo los datos',
        'warning',
      );
    }
    //Reseteando valores de formulario para nuevo usuario
    this.crearRegistroForm();
  }


  open(content) {
		this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then(
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

  //Validaciones
  get validarCorreo() {
    return correoValido(this.registroForm.get('email').value);
  }

  get validarCorreoActualizacion(){
    return correoValido(this.actualizacionForm.get('email').value);
  }

  get validarPass() {
    return passValido(this.registroForm.get('passw').value);
  }

  get validarPass2() {
    return this.registroForm.get('passw2').valid;
  }


  pruebaToken(){
    this.usuarioServicio.postToken({token:localStorage.getItem('token')}).subscribe(data => {
      //console.log(localStorage.getItem('token'))
      if (data.exito) {
        console.log(data.mensaje);
        this.Usuario = data.data.data.id;
        this.getUsuarios();
        this.getDatosRegistro();
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      }
    })
  }

}
