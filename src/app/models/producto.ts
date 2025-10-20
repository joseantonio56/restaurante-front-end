export interface Producto {
  idProducto?: number;
  descripcion: string;
  stock: number;
  precio: number;
  activo: boolean;
  rol: 'BARRA' | 'COCINA';
}
