// src/app/models/mesa.ts
export enum EstadoMesa {
  LIBRE = 'LIBRE',
  OCUPADA = 'OCUPADA'
}

export interface Mesa {
  id: number;
  estado: EstadoMesa;
}
