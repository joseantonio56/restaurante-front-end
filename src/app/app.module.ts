import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//toastr
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MesaComponent } from './components/mesa/mesa.component';
import { ProductoComponent } from './components/producto/producto.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PedidosBarraComponent } from './components/pedido-barra/pedido-barra.component';
import { PedidoCocinaComponent } from './components/pedido-cocina/pedido-cocina.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { CrearMesaComponent } from './components/crear-mesa/crear-mesa.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NavbarComponent,
    MesaComponent,
    ProductoComponent,
    UsuarioComponent,
    PedidosBarraComponent,
    PedidoCocinaComponent,
    PedidoComponent,
    VentasComponent,
    CrearMesaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
