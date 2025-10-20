import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { BehaviorSubject } from 'rxjs';

export interface PedidoTemporal {
  tipo: 'BARRA' | 'COCINA';
  productos: {
    producto: Producto;
    cantidad: number;
    subtotal: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class PedidoLocalService {

  private storageKey = 'pedidos-temporales';

  // Observable para los cambios en los pedidos
  private pedidosSubject = new BehaviorSubject<PedidoTemporal[]>(this.obtenerPedidos());
  pedidos$ = this.pedidosSubject.asObservable();

  constructor() {}

  private guardarPedidos(pedidos: PedidoTemporal[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(pedidos));
    this.pedidosSubject.next(pedidos); // Emitimos el cambio
  }

  obtenerPedidos(): PedidoTemporal[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) as PedidoTemporal[] : [];
  }

  agregarProducto(tipo: 'BARRA' | 'COCINA', producto: Producto, cantidad: number = 1): void {
    const pedidos = this.obtenerPedidos();
    let pedido = pedidos.find(p => p.tipo === tipo);
    if (!pedido) {
      pedido = { tipo, productos: [] };
      pedidos.push(pedido);
    }

    const existente = pedido.productos.find(p => p.producto.idProducto === producto.idProducto);
    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = existente.cantidad * producto.precio;
    } else {
      pedido.productos.push({
        producto,
        cantidad,
        subtotal: cantidad * producto.precio
      });
    }

    this.guardarPedidos(pedidos);
  }

  reducirProducto(tipo: 'BARRA' | 'COCINA', idProducto: number): void {
    const pedidos = this.obtenerPedidos();
    const pedido = pedidos.find(p => p.tipo === tipo);
    if (!pedido) return;

    const existente = pedido.productos.find(p => p.producto.idProducto === idProducto);
    if (existente) {
      existente.cantidad -= 1;
      if (existente.cantidad <= 0) {
        pedido.productos = pedido.productos.filter(p => p.producto.idProducto !== idProducto);
      } else {
        existente.subtotal = existente.cantidad * existente.producto.precio;
      }
      this.guardarPedidos(pedidos);
    }
  }

  eliminarProducto(tipo: 'BARRA' | 'COCINA', idProducto: number): void {
    const pedidos = this.obtenerPedidos().map(p => {
      if (p.tipo === tipo) {
        p.productos = p.productos.filter(prod => prod.producto.idProducto !== idProducto);
      }
      return p;
    });
    this.guardarPedidos(pedidos);
  }

  limpiarPedidos(tipo?: 'BARRA' | 'COCINA'): void {
    if (!tipo) {
      localStorage.removeItem(this.storageKey);
      this.pedidosSubject.next([]);
      return;
    }
    const pedidos = this.obtenerPedidos().filter(p => p.tipo !== tipo);
    this.guardarPedidos(pedidos);
  }

  obtenerProductos(tipo: 'BARRA' | 'COCINA') {
    const pedido = this.obtenerPedidos().find(p => p.tipo === tipo);
    return pedido ? pedido.productos : [];
  }

  obtenerTotal(tipo: 'BARRA' | 'COCINA'): number {
    const pedido = this.obtenerPedidos().find(p => p.tipo === tipo);
    return pedido ? pedido.productos.reduce((sum, p) => sum + p.subtotal, 0) : 0;
  }
}
