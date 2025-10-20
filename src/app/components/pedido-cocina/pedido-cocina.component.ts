// src/app/components/pedidos-cocina/pedidos-cocina.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { PedidoLocalService } from '../../services/pedido-local.service';

interface PedidoProducto {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-pedido-cocina',
  templateUrl: './pedido-cocina.component.html',
  styleUrls: ['./pedido-cocina.component.css']
})
export class PedidoCocinaComponent implements OnInit {

  productosDisponibles: Producto[] = [];
  pedidos: PedidoProducto[] = [];

  constructor(
    private toastr: ToastrService,
    private productoService: ProductoService,
    private pedidoLocalService: PedidoLocalService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarPedidos();
    // Suscripción a cambios en pedidos para actualizar automáticamente
    this.pedidoLocalService.pedidos$.subscribe(() => {
      this.cargarPedidos();
    });
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: productos => {
        this.productosDisponibles = productos.filter(p => p.rol === 'COCINA');
      },
      error: () => this.toastr.error('Error al cargar productos', 'Error')
    });
  }

  cargarPedidos(): void {
    const productos = this.pedidoLocalService.obtenerProductos('COCINA');
    this.pedidos = productos.map(p => ({
      producto: p.producto,
      cantidad: p.cantidad,
      subtotal: p.subtotal
    }));
  }

  agregarProducto(producto: Producto): void {
    if (!producto.idProducto) {
      this.toastr.error('Producto inválido: falta idProducto', 'Error');
      return;
    }
    this.pedidoLocalService.agregarProducto('COCINA', producto);
    this.toastr.success(`${producto.descripcion} agregado`, 'Producto agregado');
  }

  quitarProducto(pedidoItem: { producto: Producto; cantidad: number; subtotal: number }): void {
    if (!pedidoItem.producto.idProducto) return; // previene errores si no existe id
    this.pedidoLocalService.reducirProducto('COCINA', pedidoItem.producto.idProducto);
    this.cargarPedidos();
    this.toastr.info(`${pedidoItem.producto.descripcion} eliminado`, 'Producto eliminado');
  }

  calcularTotal(): number {
    return this.pedidos.reduce((sum, p) => sum + p.subtotal, 0);
  }
}
