import { Component, OnInit } from '@angular/core';
import { PedidoLocalService, PedidoTemporal } from '../../services/pedido-local.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MesaService } from '../../services/mesa.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';

interface VentaDetalle {
  producto: { idProducto: number, descripcion?: string };
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  pedidosBarra: any[] = [];
  pedidosCocina: any[] = [];
  ventas: any[] = [];
  ventasFiltradas: any[] = [];
  total: number = 0;

  fechaInicio: string = '';
  fechaFin: string = '';
  filtroVendedor: string = '';

  usuarioId: number | null = null;
  mesaId: number | null = null;

  private readonly ventasUrl = 'http://localhost:9000/api/ventas';

  constructor(
    private pedidoLocalService: PedidoLocalService,
    private http: HttpClient,
    private toastr: ToastrService,
    private mesaService: MesaService
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.getUsuarioIdFromLocalStorage() ?? this.usuarioId;
    this.mesaId = this.getMesaIdFromPedidoTemporal() ?? this.mesaId;

    this.cargarPedidos();
    this.cargarVentas();
    this.pedidoLocalService.pedidos$.subscribe(() => this.cargarPedidos());
  }

  private getUsuarioIdFromLocalStorage(): number | null {
    try {
      const candidates = ['usuario', 'currentUser', 'user', 'authUser', 'loggedUser'];
      for (const key of candidates) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const id =
          parsed?.idUsuario ?? parsed?.id ?? parsed?.userId ?? parsed?.usuario?.idUsuario ?? null;
        if (id) return Number(id);
      }
      return null;
    } catch { return null; }
  }

  private getMesaIdFromPedidoTemporal(): number | null {
    try {
      const raw = localStorage.getItem('pedidoTemporal');
      if (!raw) return null;
      const pedido = JSON.parse(raw);
      return pedido?.mesaId ? Number(pedido.mesaId) : null;
    } catch { return null; }
  }

  cargarPedidos(): void {
    const pedidos: PedidoTemporal[] = this.pedidoLocalService.obtenerPedidos();
    this.pedidosBarra = pedidos.find(p => p.tipo === 'BARRA')?.productos || [];
    this.pedidosCocina = pedidos.find(p => p.tipo === 'COCINA')?.productos || [];
    this.total = [...this.pedidosBarra, ...this.pedidosCocina].reduce((sum, p) => sum + (p.subtotal || 0), 0);
  }

  cargarVentas(): void {
    this.http.get<any[]>(this.ventasUrl).subscribe({
      next: data => {
        this.ventas = data || [];
        this.ventasFiltradas = [...this.ventas];
      },
      error: () => this.toastr.error('Error al cargar ventas', 'Error')
    });
  }

 crearVenta(): void {
  const usuario =
    JSON.parse(localStorage.getItem('usuario') || '{}') ||
    JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  const mesa =
    JSON.parse(localStorage.getItem('mesaSeleccionada') || '{}') ||
    JSON.parse(localStorage.getItem('mesa') || '{}');

  if (!usuario?.idUsuario || !mesa?.id) {
    this.toastr.warning('No hay usuario o mesa seleccionada', 'Aviso');
    return;
  }

  if (this.pedidosBarra.length === 0 && this.pedidosCocina.length === 0) {
    this.toastr.warning('No hay pedidos para generar la venta', 'Aviso');
    return;
  }

  const detalles = [...this.pedidosBarra, ...this.pedidosCocina].map(p => ({
    producto: { idProducto: p.producto.idProducto, descripcion: p.producto.descripcion },
    cantidad: p.cantidad,
    precio: p.producto.precio
  }));

  const nuevaVenta = {
    venta: { usuario: { idUsuario: usuario.idUsuario }, mesa: { id: mesa.id } },
    detalles
  };

  this.http.post(`${environment.apiUrl}/api/ventas`, nuevaVenta).subscribe({
    next: () => {
      this.toastr.success('Venta generada correctamente', 'Éxito');

      this.pedidoLocalService.limpiarPedidos('BARRA');
      this.pedidoLocalService.limpiarPedidos('COCINA');

      this.http.put(`${environment.apiUrl}/api/mesas/${mesa.id}/toggle`, {}).subscribe({
        next: () => {
          this.toastr.info(`Mesa ${mesa.id} liberada automáticamente`, 'Información');
          localStorage.removeItem('mesaSeleccionada');
        },
        error: () => this.toastr.error('Error al liberar la mesa', 'Error')
      });

      this.cargarPedidos();
      this.cargarVentas();
      this.total = 0;
    },
    error: () => this.toastr.error('Error al generar la venta', 'Error')
  });
}



  // ===== Filtros por fechas y vendedor =====
  filtrarVentas(): void {
    const inicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
    const fin = this.fechaFin ? new Date(this.fechaFin) : null;
    if (fin) fin.setHours(23, 59, 59, 999);

    this.ventasFiltradas = this.ventas.filter(v => {
      const fechaVenta = new Date(v.fecha);
      let coincideFecha = true;
      let coincideVendedor = true;

      if (inicio && fin) coincideFecha = fechaVenta >= inicio && fechaVenta <= fin;
      else if (inicio) coincideFecha = fechaVenta >= inicio;
      else if (fin) coincideFecha = fechaVenta <= fin;

      if (this.filtroVendedor) {
        coincideVendedor = v.usuario.nombre.toLowerCase().includes(this.filtroVendedor.toLowerCase());
      }

      return coincideFecha && coincideVendedor;
    });
  }

  limpiarFiltro(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtroVendedor = '';
    this.ventasFiltradas = [...this.ventas];
  }

  // ===== Acciones de cada venta =====
  eliminarVenta(idVenta: number): void {
    if (!confirm(`¿Deseas eliminar la venta #${idVenta}?`)) return;

    this.http.delete(`${this.ventasUrl}/${idVenta}`).subscribe({
      next: () => {
        this.toastr.success(`Venta #${idVenta} eliminada`, 'Éxito');
        this.cargarVentas();
      },
      error: () => this.toastr.error('Error al eliminar la venta', 'Error')
    });
  }

  generarPDF(idVenta: number): void {
    const venta = this.ventas.find(v => v.idVenta === idVenta);
    if (!venta) {
      this.toastr.error('Venta no encontrada', 'Error');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Venta #${venta.idVenta}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, 14, 30);
    doc.text(`Vendedor: ${venta.usuario.nombre}`, 14, 38);
    doc.text(`Mesa: ${venta.mesa.id}`, 14, 46);

    const columnas = ['Producto', 'Cantidad', 'Precio', 'Subtotal'];
    const filas = venta.detalles.map((d: VentaDetalle) => [
      d.producto.descripcion || `ID ${d.producto.idProducto}`,
      d.cantidad,
      `${d.precio.toFixed(2)} €`,
      `${(d.precio * d.cantidad).toFixed(2)} €`
    ]);

    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 55,
      theme: 'grid'
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 65;
    doc.text(`Total: ${venta.total.toFixed(2)} €`, 14, finalY + 10);

    doc.save(`venta_${venta.idVenta}.pdf`);
  }
}
