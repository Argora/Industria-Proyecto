import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  url = 'https://hondumarket-info.store:3000/api/notisPush'
  //Local
  //url = 'http://localhost:3000/api/notisPush'

  constructor(private http: HttpClient) { }

  guardarToken(token, user_id, time):Observable<any> {
    return this.http.post(this.url+`/guardarCredencial/${user_id}`, token, time);
  }
}
