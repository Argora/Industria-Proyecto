import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //url = 'https://hondumarket-info.store:3000/api/chat'
  //URL LOCAL
  url = 'http://localhost:3000/api/chat'

  constructor(private http:HttpClient) { }

  getChatsPersona(id: number):Observable<any> {

    return this.http.get(this.url+`/getListaChats/${id}`);
  };

  getMensajesPersona(usuarioId: number, personaId: number):Observable<any> {

    return this.http.get(this.url+`/getMensajes/${usuarioId}/${personaId}`);
  };

  postEnviarMensaje( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/enviarMensaje',req_body);
  };
  
  postBorrarMensajes( req_body : any ):Observable<any> {

    return this.http.post(this.url+'/borrarChat',req_body);
  };
}
