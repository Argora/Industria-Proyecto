import { NgModule, isDevMode } from '@angular/core';
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
import { ConfirmarCuentaComponent } from './components/confirmar-cuenta/confirmar-cuenta.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { ComprarPremiumComponent } from './components/comprar-premium/comprar-premium.component';

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
    RegistroComponent,
    ConfirmarCuentaComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    AdminHomeComponent,
    FavoritosComponent,
    ComprarPremiumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NgxDropzoneModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
