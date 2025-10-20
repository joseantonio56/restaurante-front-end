// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment'; // Importa environment

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Usamos environment.apiUrl para que sea configurable
  private baseUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    const body = {
      ...usuario,
      contraseña: usuario.contrasena // Mapeamos al backend
    };
    delete (body as any).contrasena; // eliminamos la propiedad interna
    return this.http.post<Usuario>(this.baseUrl, body);
  }

  // Actualizar un usuario existente
  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    const body = {
      ...usuario,
      contraseña: usuario.contrasena // Mapeamos al backend
    };
    delete (body as any).contrasena;
    return this.http.put<Usuario>(`${this.baseUrl}/${usuario.idUsuario}`, body);
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
