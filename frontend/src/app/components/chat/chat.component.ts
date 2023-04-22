import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ChatService } from 'src/app/services/chat.service';
import { NuevoChatService } from 'src/app/services/nuevo-chat.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  seleccionado: boolean = false;
  mensaje = new FormGroup({
    contenido: new FormControl("", Validators.required),
  });
  chat = []; //lista de mensajes del chat actual
  personaId = 0; //id de el usuario con el que se esta chateando
  nameActualChat = '' //nombre del usuario con el que se esta chateando;
  userId = 0; //id del usuario logeado
  chatList: [
    {
      chatPersona: string, 
      chatPersonaId: number, 
      ultimo: {
        emisor: number
        receptor: number,
        mensaje: string
      }
    }
  ]; //lista de chats

  message: {
    user: number,
    person: number,
    message: string,
    date: Date
  }//mensaje actual del usuario logeado

  constructor(
    private socket : SocketioService,
    private usuarioServicio : UsuarioService,
    private chatServicio : ChatService,
    private nuevoChat : NuevoChatService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.pruebaToken();
    this.socket.listenPrivateMessage().subscribe((messageInfo:{user: number,person: number,message: string,date: Date})=>{
      if(messageInfo.person == this.userId){ 
        if(messageInfo.user == this.personaId){
          this.chat.push(messageInfo);
          this.chatList.forEach(chat =>{
            if(chat.chatPersonaId == this.personaId){
              chat.ultimo.mensaje = messageInfo.message;
            }
          });
        }else{
          this.actualizarMensajes(messageInfo);
        }
      }
    });
  }

  mostrar(id: number, name: string) {
    this.resetChat([]);
    this.personaId = id;
    this.nameActualChat = name;
    this.getMensajesPersona();
    this.socket.joinRoom(id);
    this.seleccionado = true;
  }

  agregar() {
    console.log('Se presiono el boton');
    
  }

  newChat(data){
    var chat = {
      chatPersona: data.chatPersona,
      chatPersonaId: data.chatPersonaId,
      ultimo: data.ultimo
    }
    this.chatList.push(chat);
    console.log(this.chatList);
  }

  resetChat(newChat){
    this.chat = newChat;
  }

  getChatsPersona(){
    var nChat = this.nuevoChat.getNewChat();
    this.chatServicio.getChatsPersona(this.userId).subscribe(data => {
      if(data.exito){
        console.log(data.mensaje);
        this.chatList = data.chatPersonas;
        //console.log(this.chatList);
        this.getUltimo();
        var isNew = false;
        if(nChat.chatPersonaId!=0){
          this.chatList.forEach(chat =>{
            if(chat.chatPersonaId == nChat.chatPersonaId){
              isNew = true;
            }
          });
          if(!isNew){
            console.log("nuevo chat");
            this.newChat(nChat);
          }
          this.mostrar(nChat.chatPersonaId, nChat.chatPersona);
        }
      }
      else{
        console.log(data.mensaje);
        if(nChat.chatPersonaId!=0){
          this.chatList = [nChat];
          this.mostrar(nChat.chatPersonaId, nChat.chatPersona);
        }
      }
    }, err => console.log(err));
    this.nuevoChat.deleteNewChat();
  }

  getUltimo(){
    this.chatList.forEach(chat =>{
      this.chatServicio.getMensajesPersona(this.userId, chat.chatPersonaId).subscribe(data =>{
        if(data.exito){
          chat.ultimo = data.mensajesPersona[data.mensajesPersona.length-1];
          if(chat.ultimo.emisor==this.userId){
            chat.ultimo.mensaje = `Tu: ${chat.ultimo.mensaje}`;
          }
        }else{
          console.log(data.mensaje);
        }
      }, err => console.log(err));
    });
  }

  actualizarMensajes(messageInfo){
    console.log('mensaje recibido');
    var nuevo = true;
    this.chatList.forEach(chat =>{
      if(chat.chatPersonaId == messageInfo.user){
        nuevo = false;
        chat.ultimo.mensaje = messageInfo.message;
      }
    });
    if(nuevo){
      this.usuarioServicio.getDetallesVendedor(messageInfo.user).subscribe(
        (data) => {
          if (data.exito) {
            var chatNuevo = {
              chatPersona: data.usuario.nombre, 
              chatPersonaId: messageInfo.user, 
              ultimo: {
                emisor: messageInfo.user,
                receptor: this.userId,
                mensaje: messageInfo.message
              }
            }
            this.chatList.push(chatNuevo);
          } else {
            console.log(data.mensaje);
          }
        },
        (err) => console.log(err)
      );
    }
  }

  pruebaToken(){
    this.usuarioServicio.postToken({token:localStorage.getItem('token')}).subscribe(data => {
      //console.log(localStorage.getItem('token'))
      if (data.exito) {
        console.log(data.mensaje);
        this.userId = data.data.data.id;
        this.socket.connection(this.userId);
        this.getChatsPersona();
      }
      else {
        console.log(data.mensaje);
        localStorage.removeItem('token');
        Swal.fire(
          'ERROR!',
          'No ha iniciado sesión',
          'warning',
        );
        this.router.navigate(['login']);
      }
    })
  }

  getMensajesPersona(){
    this.chatServicio.getMensajesPersona(this.userId, this.personaId).subscribe(data =>{
      if(data.exito){
        console.log(data.mensaje);
        //console.log(data);
        var newChat = [];
        data.mensajesPersona.forEach(mensaje => {
          var message = {
            message: mensaje.mensaje,
            user: mensaje.emisor,
            date: mensaje.creacion
          }
          newChat.push(message);
        });
        this.resetChat(newChat);
      }
      else{
        console.log(data.mensaje);
        this.resetChat([]);
      }
    }, err => console.log(err));
  }

  sendMessage(){
    let dateTime = new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"});
    //console.log(this.mensaje.value.contenido);
    let messageInfo = {
      message: this.mensaje.value.contenido,
      user: this.userId,
      person: this.personaId,
      date: dateTime
    }
    //console.log(messageInfo);
    //this.socket.sendMessage(messageInfo);
    this.chatList.forEach(chat =>{
      if(chat.chatPersonaId == this.personaId){
        chat.ultimo.mensaje = `Tu: ${messageInfo.message}`;
      }
    });

    this.chat.push(messageInfo);
    this.socket.privateMessage(messageInfo);
    this.guardarMensaje();
    //limpiar texto de mensaje
    this.mensaje.reset();
  }

  guardarMensaje(){
    let data = {
      emisor: this.userId,
      receptor: this.personaId,
      mensaje: this.mensaje.value.contenido
    }
    console.log(data)
    this.chatServicio.postEnviarMensaje(data).subscribe(data =>{
      if(data.exito){
        console.log(data.mensaje);
      }else{
        console.log(data.mensaje);
      }
    }, err =>console.log(err));
  }

  borrarMensajes(){
    Swal.fire({
      title: 'Estas seguro?',
      text: "Se eliminara todos los mensajes de esta conversación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("borrar mensajes de usuario: "+this.personaId);
        var datos = {
          usuarioId: this.userId,
          chatPersonaId: this.personaId
        }
        this.chatServicio.postBorrarMensajes(datos).subscribe(data=>{
          if(data.exito){
            console.log(data.mensaje);
            this.resetChat([]);
            this.router.navigateByUrl('perfil', { skipLocationChange: true }).then(() => {
              this.router.navigate(['chat']);
          }); 
          }else{
            console.log(data.mensaje);
          }
        }, err => console.log(err));
      }
    })
    
  }

}
