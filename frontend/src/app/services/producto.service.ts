import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  //url = 'https://hondumarket-info.store:3000/api/productos'
  //URL LOCAL
  url = 'http://localhost:3000/api/productos'

  constructor(private http:HttpClient) { }

  postInsertNewProducto( req_body : any, id: number):Observable<any> {

    return this.http.post(this.url+`/nuevoProducto/${id}`,req_body);
  };

  getDatosRegistroProducto():Observable<any> {

    return this.http.get(this.url+'/datosregistroProducto');
  };
  
  getProductos():Observable<any> {

    return this.http.get(this.url+'/getAll');
  };

  getProductoDetalle(id: number):Observable<any> {

    return this.http.get(this.url+`/detalles/${id}`);
  };

  getProductosUsuario(id: number):Observable<any> {

    return this.http.get(this.url+`/getProductosUsuario/${id}`);
  };

  eliminarProducto(id: number):Observable<any> {

    return this.http.delete(this.url+`/borrarProducto/${id}`);
  };

}
