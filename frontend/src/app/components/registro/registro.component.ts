import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { correoValido, passValido, passwordMatchValidator } from './registro.helper';
import Swal from 'sweetalert2';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup;
  usuario = {};
  endpoint = '';

  public readonly VAPID_PUBLIC_KEY:string = 'BMyCzy-snI3LlMzPmVl5fjtlBibF_fmaQFA0jHGlmcARDnscvPtjNa23YdqvyJuu0ujbnsNaXYKlyUqBQlUUE20';

  constructor(private router: Router,
    private usuarioServicio: UsuarioService,
    private swPush: SwPush) { }

  ngOnInit(): void {
    this.getDatosRegistro();
    this.crearRegistroForm();
  }

  //Obteniendo datos de registro
  departamentos = [];
  municipios = [];

  subscribeToNotifications(): any {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(sub => {
      const token = JSON.parse(JSON.stringify(sub));
      console.log('***ojo***', token);
      this.endpoint = token.endpoint;
    }).catch(err => console.error('error en ', err));
  }

  getDatosRegistro() {

    this.usuarioServicio.getDatosMunicipios().subscribe(data => {

      this.departamentos = data.departamentos;
      this.municipios = data.municipios;

    }, err => console.log(err));
  }

  crearRegistroForm(): void {
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
      termino: new FormControl(false, Validators.requiredTrue),
      suscripcion: new FormControl("", Validators.required)
    }, passwordMatchValidator)
  }

  get filtrarMunicipios() {

    var municipio = this.municipios.filter(e => {
      return e.departamentoId == this.registroForm.get('departamento').value;
    });

    return municipio;
  }

  aceptarTerminos() {
    console.log('terminos aceptados');
    this.registroForm.get('termino').setValue(true);
  }

  registrarUsuario() {
    var usuario = this.registroForm.value;

    this.usuario = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      passw: usuario.passw,
      municipio: usuario.municipio,
      departamento: usuario.departamento,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      suscripcion: usuario.suscripcion,
      endpoint: this.endpoint
    };

    if (this.registroForm.valid && this.validarCorreo && this.validarPass) {

      this.usuarioServicio.postRegistrarUsuario(this.usuario).subscribe(result => {

        if (result.guardado) {

          //console.log(result.mensaje);
          Swal.fire({
            title: 'Usuario registrado',
            text: "Puede activar su usuario desde el enlace enviado a su correo electronico",
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['login'])
            }
          });

        } else {
          console.log(result.mensaje);
          this.router.navigate(['registro']);
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
  }

  //Validaciones
  get validarCorreo() {
    return correoValido(this.registroForm.get('email').value);
  }

  get validarPass() {
    return passValido(this.registroForm.get('passw').value);
  }

  get validarPass2() {
    return this.registroForm.get('passw2').valid;
  }


}
