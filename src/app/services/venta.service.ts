// src/app/services/venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importa environment

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  // Usamos environment.apiUrl para que sea configurable
  private apiUrl = `${environment.apiUrl}/api/ventas`;

  constructor(private http: HttpClient) {}

  // Obtener todas las ventas
  obtenerVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva venta
  crearVenta(ventaData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ventaData);
  }
}
