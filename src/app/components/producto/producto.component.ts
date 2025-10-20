import { Component, OnInit } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtroRol: string = 'TODOS';

  nuevoProducto: Producto = {
    descripcion: '',
    stock: 0,
    precio: 0,
    activo: true,
    rol: 'BARRA'
  };
  editando: boolean = false;

  constructor(
    private productoService: ProductoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrarProductos();
      },
      error: () => this.toastr.error('Error al cargar productos', 'Error')
    });
  }

  filtrarProductos(): void {
    if (this.filtroRol === 'TODOS') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(p => p.rol === this.filtroRol);
    }
  }

  cambiarFiltro(rol: string): void {
    this.filtroRol = rol;
    this.filtrarProductos();
  }

  guardarProducto(): void {
    if (this.editando) {
      this.productoService.actualizarProducto(this.nuevoProducto).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado', 'OK');
          this.cargarProductos();
          this.resetForm();
        },
        error: () => this.toastr.error('Error al actualizar producto', 'Error')
      });
    } else {
      this.productoService.crearProducto(this.nuevoProducto).subscribe({
        next: () => {
          this.toastr.success('Producto creado', 'OK');
          this.cargarProductos();
          this.resetForm();
        },
        error: () => this.toastr.error('Error al crear producto', 'Error')
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.nuevoProducto = { ...producto };
    this.editando = true;
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.toastr.success('Producto eliminado', 'OK');
          this.cargarProductos();
        },
        error: () => this.toastr.error('Error al eliminar producto', 'Error')
      });
    }
  }

  resetForm(): void {
    this.nuevoProducto = {
      descripcion: '',
      stock: 0,
      precio: 0,
      activo: true,
      rol: 'BARRA'
    };
    this.editando = false;
  }
}
