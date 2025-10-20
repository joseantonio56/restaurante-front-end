import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mesa, EstadoMesa } from '../../models/mesa';
import { MesaService } from '../../services/mesa.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  mesas: Mesa[] = [];
  mesaSeleccionada: Mesa | null = null;
  mostrarOpciones: boolean = false;
  mostrarPedidoBarra: boolean = false; // controla mostrar <app-pedido-barra>

  constructor(
    private mesaService: MesaService,
    private router: Router,          // lo dejamos por seguridad
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.mesaService.obtenerMesas().subscribe({
      next: (data: Mesa[]) => this.mesas = data,
      error: (err: any) => console.error('Error al cargar mesas', err)
    });
  }

  private actualizarMesaLocalmente(updatedMesa: Mesa): void {
    const index = this.mesas.findIndex(m => m.id === updatedMesa.id);
    if (index >= 0) {
      this.mesas[index] = updatedMesa;
      if (this.mesaSeleccionada && this.mesaSeleccionada.id === updatedMesa.id) {
        this.mesaSeleccionada = updatedMesa;
      }
    }
  }

 // dentro de InicioComponent
gestionarClickMesa(mesa: Mesa): void {
  // si es doble click y ya está abierto, cerramos
  if (this.mesaSeleccionada && this.mesaSeleccionada.id === mesa.id && this.mostrarOpciones) {
    this.cerrarOpciones();
    return;
  }

  // seleccionar la mesa en memoria y en localStorage
  this.mesaSeleccionada = mesa;
  try {
    localStorage.setItem('mesaSeleccionada', JSON.stringify(mesa));
  } catch (e) {
    console.warn('No se pudo guardar mesaSeleccionada en localStorage', e);
  }

  if (mesa.estado === EstadoMesa.LIBRE) {
    this.ocuparMesa(mesa.id);
  } else {
    this.mostrarOpciones = true;
  }
}


  ocuparMesa(idMesa: number): void {
    this.mesaService.toggleEstadoMesa(idMesa).subscribe({
      next: updatedMesa => {
        this.actualizarMesaLocalmente(updatedMesa);
        this.toastr.info(`Mesa #${idMesa} ahora está ${updatedMesa.estado}`, 'Estado Actualizado');

        if (updatedMesa.estado === EstadoMesa.OCUPADA) {
          this.mostrarOpciones = true;
        } else {
          this.cerrarOpciones();
        }
      },
      error: err => {
        console.error('Error al ocupar mesa', err);
        this.toastr.error('Error al contactar con el servidor', 'Fallo de API');
      }
    });
  }

  liberarMesa(): void {
    if (!this.mesaSeleccionada) return;

    this.mesaService.toggleEstadoMesa(this.mesaSeleccionada.id).subscribe({
      next: updatedMesa => {
        this.actualizarMesaLocalmente(updatedMesa);
        this.toastr.success(`Mesa #${updatedMesa.id} liberada correctamente`, 'Venta finalizada');
        this.cerrarOpciones();
      },
      error: err => {
        console.error('Error al liberar mesa', err);
        this.toastr.error('Error al liberar mesa', 'Fallo de API');
      }
    });
  }

abrirProductos(rol: 'BARRA' | 'COCINA'): void {
  if (!this.mesaSeleccionada) return;

  const pedidoTemporal = {
    mesaId: this.mesaSeleccionada.id,
    cliente: 'Temporal',
    productos: [],
    tipo: rol,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('pedidoTemporal', JSON.stringify(pedidoTemporal));
  // opcional: guardamos también mesaSeleccionada redundante
  localStorage.setItem('mesaSeleccionada', JSON.stringify(this.mesaSeleccionada));

  this.toastr.success(`Pedido temporal iniciado para Mesa #${this.mesaSeleccionada.id}`, 'Iniciando Pedido');
  this.router.navigate(['/pedido-barra'], { queryParams: { tipo: rol } });
  this.cerrarOpciones();
}




  cerrarOpciones(keepSelection: boolean = false): void {
    this.mostrarOpciones = false;
    if (!keepSelection) {
      this.mesaSeleccionada = null;
      this.cargarMesas();
    }
  }
}
