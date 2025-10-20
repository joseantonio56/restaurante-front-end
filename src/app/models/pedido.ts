export interface ProductoPedido {
  idProducto: number;
  descripcion?: string; // opcional, solo para mostrar en tabla
  cantidad: number;
  rol?: 'BARRA' | 'COCINA'; // para filtrar según tipo de producto
}

export interface Pedido {
  idPedido?: number;         // autogenerado en BD
  idMesa: number;            // mesa asociada
  idUsuario: number;         // mesero o usuario que crea el pedido
  productos: ProductoPedido[]; // lista de productos con cantidad
  fechaHora?: string;        // opcional (backend lo genera)
  estado?: string;           // PENDIENTE, EN_PROCESO, FINALIZADO
}
