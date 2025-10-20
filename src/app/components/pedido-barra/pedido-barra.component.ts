// src/app/components/pedidos-barra/pedidos-barra.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { PedidoLocalService } from '../../services/pedido-local.service';

@Component({
  selector: 'app-pedido-barra',
  templateUrl: './pedido-barra.component.html',
  styleUrls: ['./pedido-barra.component.css']
})
export class PedidosBarraComponent implements OnInit {

  productosDisponibles: Producto[] = [];
  pedidos: Array<{ producto: Producto, cantidad: number, subtotal: number }> = [];

  constructor(
    private toastr: ToastrService,
    private productoService: ProductoService,
    private pedidoLocalService: PedidoLocalService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarPedidos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: productos => {
        this.productosDisponibles = productos.filter(p => p.rol === 'BARRA');
      },
      error: () => this.toastr.error('Error al cargar productos', 'Error')
    });
  }

  cargarPedidos(): void {
    this.pedidos = this.pedidoLocalService.obtenerProductos('BARRA') || [];
  }

  agregarProducto(producto: Producto): void {
    if (!producto.idProducto) return;
    this.pedidoLocalService.agregarProducto('BARRA', producto, 1);
    this.cargarPedidos();
    this.toastr.success(`${producto.descripcion} agregado`, 'Producto agregado');
  }

  quitarProducto(pedidoItem: { producto: Producto, cantidad: number, subtotal: number }): void {
    if (!pedidoItem.producto.idProducto) return; // asegura que idProducto no sea undefined
    this.pedidoLocalService.reducirProducto('BARRA', pedidoItem.producto.idProducto);
    this.cargarPedidos();
    this.toastr.info(`${pedidoItem.producto.descripcion} eliminado`, 'Producto eliminado');
  }

  calcularTotal(): number {
    return this.pedidos.reduce((sum, p) => sum + p.subtotal, 0);
  }
}
