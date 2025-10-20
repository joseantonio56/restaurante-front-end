import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Mesa, EstadoMesa } from 'src/app/models/mesa';
import { MesaService } from 'src/app/services/mesa.service';

@Component({
  selector: 'app-crear-mesa',
  templateUrl: './crear-mesa.component.html',
})
export class CrearMesaComponent implements OnInit {
  mesas: Mesa[] = [];

  constructor(
    private mesaService: MesaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  // Crear nueva mesa
  crearMesa() {
    const nuevaMesa: Partial<Mesa> = { estado: EstadoMesa.LIBRE };

    this.mesaService.crearMesa(nuevaMesa as Mesa).subscribe({
      next: () => {
        this.toastr.success('Mesa creada correctamente', 'Éxito');
        this.cargarMesas();
      },
      error: () => {
        this.toastr.error('No se pudo crear la mesa', 'Error');
      }
    });
  }

eliminarMesa(mesa: Mesa) {
  if (!confirm(`¿Deseas eliminar la mesa con id ${mesa.id}?`)) return;

  this.mesaService.eliminarMesa(mesa.id).subscribe({
    next: () => {
      // Mostramos el toast antes de actualizar la lista
      this.toastr.success('Mesa eliminada correctamente', 'Éxito', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });

      // Actualizamos la lista después de un pequeño delay para que el toast aparezca
      setTimeout(() => {
        this.cargarMesas();
      }, 100);
    },
    error: (err) => {
      console.error('Error al eliminar la mesa:', err);
      this.toastr.error('No se pudo eliminar la mesa', 'Error', {
        timeOut: 3000,
        progressBar: true,
        positionClass: 'toast-top-center'
      });
    }
  });
}


  // Cargar todas las mesas
cargarMesas() {
  this.mesaService.obtenerMesas().subscribe({
    next: (data) => {
      // Ordenamos por id ascendente
      this.mesas = data.sort((a, b) => a.id - b.id);
    },
    error: (err) => console.error(err)
  });
}

}
