import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetallesProductoComponent } from './components/detalles-producto/detalles-producto.component';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RegistrarProductoComponent } from './components/registrar-producto/registrar-producto.component';

const routes: Routes = [
  { path: 'productos', component: ProductosComponent },
  { path: 'productos/detalles/:id', component: DetallesProductoComponent },
  { path: 'productos/misProductos', component: MisProductosComponent },
  { path: 'productos/registrar', component: RegistrarProductoComponent },
  { path:'**', pathMatch:'full', redirectTo:'productos' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
