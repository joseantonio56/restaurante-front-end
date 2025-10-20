import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs'; // Importa environment
import { environment } from 'src/environments/environment';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // Usamos environment.apiUrl para que sea configurable
  private url = `${environment.apiUrl}/api/usuarios`;
  private usuarioKey = 'usuario'; // clave en localStorage
  private rolKey = 'rol'; // clave antigua para compatibilidad

  constructor(private http: HttpClient) {}

  // Verifica usuario y guarda en localStorage
  verificarUsuario(email: string, password: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(this.url).pipe(
      map(usuarios => {
        const user = usuarios.find(u => u.email === email && u.contraseña === password && u.activo);
        if (user) {
          this.guardarUsuario(user);
          this.guardarRol(user.rol); // para compatibilidad
          return user;
        }
        return null;
      })
    );
  }

  // Guardar usuario completo en localStorage
  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  // Obtener usuario logueado
  obtenerUsuario(): Usuario | null {
    const data = localStorage.getItem(this.usuarioKey);
    return data ? JSON.parse(data) : null;
  }

  // Guardar solo el rol (compatibilidad)
  guardarRol(rol: string): void {
    localStorage.setItem(this.rolKey, rol);
  }

  // Obtener solo el rol (compatibilidad)
  obtenerRol(): string | null {
    return localStorage.getItem(this.rolKey);
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.usuarioKey);
    localStorage.removeItem(this.rolKey);
  }
}
