import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Importa environment
import { Mesa } from '../models/mesa';



@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private url = `${environment.apiUrl}/api/mesas`;

  constructor(private http: HttpClient) {}

  // Obtener todas las mesas
  obtenerMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.url);
  }

  // Obtener una mesa por id
  obtenerMesaPorId(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.url}/${id}`);
  }

  // Crear nueva mesa
  crearMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.url, mesa);
  }

  // Actualizar mesa completa
  actualizarMesa(id: number, mesa: Mesa): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.url}/${id}`, mesa);
  }

  // Eliminar mesa
  eliminarMesa(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  // Cambiar solo el estado de la mesa (toggle LIBRE/OCUPADA)
  toggleEstadoMesa(id: number): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.url}/${id}/toggle`, {});
  }
}
