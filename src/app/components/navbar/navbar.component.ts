import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router, NavigationEnd } from '@angular/router';
import { PedidoLocalService } from '../../services/pedido-local.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  rol: string | null = null;
  currentRoute: string = '';
  totalPedidosBarra: number = 0;
  totalPedidosCocina: number = 0;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private pedidoLocalService: PedidoLocalService
  ) {
    // Detectar cambios de ruta y actualizar los totales
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.actualizarTotales();
      }
    });
  }

  ngOnInit(): void {
    this.rol = this.loginService.obtenerRol();

    // Suscribirse a los cambios de pedidos en tiempo real
    this.pedidoLocalService.pedidos$.subscribe(() => {
      this.actualizarTotales();
    });

    // Inicializar valores al cargar
    this.actualizarTotales();
  }

  actualizarTotales(): void {
    const productosBarra = this.pedidoLocalService.obtenerProductos('BARRA');
    const productosCocina = this.pedidoLocalService.obtenerProductos('COCINA');

    // 🔹 Mostrar el total real de productos (sumando cantidades)
    this.totalPedidosBarra = productosBarra
      ? productosBarra.reduce((sum, p) => sum + p.cantidad, 0)
      : 0;

    this.totalPedidosCocina = productosCocina
      ? productosCocina.reduce((sum, p) => sum + p.cantidad, 0)
      : 0;
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  getBienvenida(): string {
    if (this.rol === 'ROLE_ADMIN') return 'Administrador';
    if (this.rol === 'ROLE_USER') return 'Usuario';
    return '';
  }
}
