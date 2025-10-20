import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  tipo: 'BARRA' | 'COCINA' = 'BARRA';
  productos: Producto[] = [];
  pedidoTemporal: any = { mesaId: 0, productos: [] };

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Obtener tipo desde la URL (BARRA o COCINA)
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] === 'COCINA' ? 'COCINA' : 'BARRA';
      this.cargarProductosPorRol();
    });

    // Cargar pedido temporal si ya existe
    const pedidoGuardado = localStorage.getItem('pedidoTemporal');
    if (pedidoGuardado) {
      this.pedidoTemporal = JSON.parse(pedidoGuardado);
    }
  }

  cargarProductosPorRol(): void {
    this.productoService.obtenerProductosPorRol(this.tipo).subscribe({
      next: data => this.productos = data,
      error: err => console.error('Error al cargar productos', err)
    });
  }

  agregarProducto(producto: Producto): void {
    // Buscar si ya existe en el pedido
    const existe = this.pedidoTemporal.productos.find((p: any) => p.idProducto === producto.idProducto);

    if (existe) {
      existe.cantidad += 1;
    } else {
      this.pedidoTemporal.productos.push({
        idProducto: producto.idProducto,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidad: 1
      });
    }

    // Guardar en localStorage
    localStorage.setItem('pedidoTemporal', JSON.stringify(this.pedidoTemporal));
    this.toastr.success(`${producto.descripcion} añadido`, 'Producto agregado');
  }
}
