import { Component, OnInit } from '@angular/core';
import { Mesa, EstadoMesa } from '../../models/mesa';
import { MesaService } from '../../services/mesa.service';

@Component({
  selector: 'app-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css']
})
export class MesaComponent implements OnInit {

  mesas: Mesa[] = [];
  mesaSeleccionada: Mesa | null = null;
  mostrarOpciones: boolean = false;

  constructor(private mesaService: MesaService) { }

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.mesaService.obtenerMesas().subscribe((data: Mesa[]) => {
      this.mesas = data;
    });
  }

  seleccionarMesa(mesa: Mesa): void {
    this.mesaSeleccionada = mesa;
    this.mesaService.toggleEstadoMesa(mesa.id).subscribe(res => {
      this.mostrarOpciones = true;
    });
  }

  cerrarOpciones(): void {
    this.mostrarOpciones = false;
    this.mesaSeleccionada = null;
  }
}
