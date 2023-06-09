import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'https://hondumarket-info.store:3000/api/usuarios'
  //URL LOCAL
  // url = 'http://localhost:3000/api/usuarios'

  constructor(private http:HttpClient) { }

  getDatosMunicipios():Observable<any> {

    return this.http.get(this.url+'/datosMunicipios');
  };

  postRegistrarUsuario( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/registro',req_body);
  };

  postConfirmarCuenta( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/confirmarUsuario',req_body);
  };

  postLogIn( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/logIn',req_body);
  };

  postToken( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/token',req_body);
  };

  getPerfilUsuario(id: number):Observable<any> {

    return this.http.get(this.url+`/perfilUsuario/${id}`);
  };

  getDetallesVendedor(id: number):Observable<any> {

    return this.http.get(this.url+`/detallesVendedor/${id}`);
  };


  //Categorias

  getSubscripciones(id: number):Observable<any> {

    return this.http.get(this.url+`/suscripciones/${id}`);
  };

  postInscribirCategoria( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/suscribirCategoria',req_body);
  };

  postcancelarSuscripcion( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/cancelarSuscripcion',req_body);
  };


  //Favoritos

  postAgregarFavorito( req_body : any ):Observable<any> {
    
    return this.http.post(this.url+'/agregarFavorito',req_body);
  }

  postEliminarFavorito( req_body : any ):Observable<any> {
    
    return this.http.post(this.url+'/eliminarFavorito',req_body);
  }

  postEstadoFavorito( req_body : any ):Observable<any> {
    
    return this.http.post(this.url+'/estadoFavorito',req_body);
  }

  getFavoritos(id: number):Observable<any> {

    return this.http.get(this.url+`/listaFavoritos/${id}`);
  };


}
