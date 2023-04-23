import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetallesProductoComponent } from './components/detalles-producto/detalles-producto.component';
import { LoginComponent } from './components/login/login.component';
import { MisProductosComponent } from './components/mis-productos/mis-productos.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RegistrarProductoComponent } from './components/registrar-producto/registrar-producto.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ConfirmarCuentaComponent } from './components/confirmar-cuenta/confirmar-cuenta.component';
import { HomeComponent } from './components/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ChatComponent } from './components/chat/chat.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { ComprarPremiumComponent } from './components/comprar-premium/comprar-premium.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'confirmarUsuario/:token', component: ConfirmarCuentaComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'productos/detalles/:id', component: DetallesProductoComponent },
  { path: 'productos/misProductos', component: MisProductosComponent },
  { path: 'productos/registrar', component: RegistrarProductoComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'premium', component: ComprarPremiumComponent },
  { path: 'adminHome', component: AdminHomeComponent },
  { path: 'adminProductos', component: AdminProductosComponent },
  { path: 'adminUsuarios', component: AdminUsuariosComponent },
  { path: 'bitacora', component: BitacoraComponent },
  { path:'**', pathMatch:'full', redirectTo:'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
