import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = 'http://localhost:3000/api/usuarios'

  constructor(private http:HttpClient) { }

  getDatosMunicipios():Observable<any> {

    return this.http.get(this.url+'/datosMunicipios');
  };

  postRegistrarUsuario( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/registro',req_body);
  };

}
