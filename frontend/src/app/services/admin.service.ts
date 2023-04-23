import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  //url = 'https://hondumarket-info.store:3000/api/admin'
  //URL LOCAL
  url = 'http://localhost:3000/api/admin'

  constructor(private http:HttpClient) { }

  getProductosAdmin():Observable<any> {

    return this.http.get(this.url+'/getProductosAdmin');
  };

  actualizarProductoAdmin(req_body : any):Observable<any> {

    return this.http.put(this.url+`/actualizarProductoAdmin`,req_body);
  };
}
