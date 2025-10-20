import { Usuario } from './usuario';
import { Mesa } from './mesa';

export interface Venta {
  idVenta: number;
  fecha: string;       // Se puede transformar a Date si lo prefieres
  total: number;
  usuario: Usuario;
  mesa: Mesa;
}
