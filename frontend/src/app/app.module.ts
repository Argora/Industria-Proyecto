import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ProductosComponent } from './components/productos/productos.component';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { RegistrarProductoComponent } from './components/registrar-producto/registrar-producto.component';
import { DetallesProductoComponent } from './components/detalles-producto/detalles-producto.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    MisProductosComponent,
    RegistrarProductoComponent,
    DetallesProductoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
