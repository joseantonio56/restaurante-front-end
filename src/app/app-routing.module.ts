import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ProductoComponent } from './components/producto/producto.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PedidosBarraComponent } from './components/pedido-barra/pedido-barra.component';
import { PedidoCocinaComponent } from './components/pedido-cocina/pedido-cocina.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { VentasComponent } from './components/ventas/ventas.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'productos', component: ProductoComponent },
  { path: 'usuarios', component: UsuarioComponent },
  {path: 'pedido-barra', component: PedidosBarraComponent},
  {path: 'pedido-cocina', component: PedidoCocinaComponent},
  {path:'pedido',component:PedidoComponent},
  {path:'ventas',component:VentasComponent},
  { path: '**', redirectTo: 'login' } // Redirección por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
