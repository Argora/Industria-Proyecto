import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NuevoChatService {

  nuevoChat = {
    chatPersona: '', 
    chatPersonaId: 0,
    ultimo: {
      emisor: 0,
      receptor: 0,
      mensaje: ''
    }
  }

  constructor() { }

  addNewChat(chatPersona: string, chatPersonaId: number){
    this.nuevoChat = {
      chatPersona : chatPersona, 
      chatPersonaId : chatPersonaId,
      ultimo: {
        emisor: 0,
        receptor: 0,
        mensaje: ''
      }
    }
  }

  deleteNewChat(){
    this.nuevoChat = {
      chatPersona: '', 
      chatPersonaId: 0,
      ultimo: {
        emisor: 0,
        receptor: 0,
        mensaje: ''
      }
    }
  }

  getNewChat(){
    return this.nuevoChat
  }
}
