import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  url = 'http://23.22.224.30:3000/api/productos'

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

}
