// src/app/models/usuario.ts
export interface Usuario {
  idUsuario?: number;
  nombre: string;
  email: string;
  contrasena: string;   // alias interno de Angular
  rol: string;
  activo: boolean;
   contraseña: string; // <- aquí
}
