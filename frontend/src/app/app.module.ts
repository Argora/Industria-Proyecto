import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ProductosComponent } from './components/productos/productos.component';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { RegistrarProductoComponent } from './components/registrar-producto/registrar-producto.component';
import { DetallesProductoComponent } from './components/detalles-producto/detalles-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    MisProductosComponent,
    RegistrarProductoComponent,
    DetallesProductoComponent,
    PerfilComponent,
    ChatComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
