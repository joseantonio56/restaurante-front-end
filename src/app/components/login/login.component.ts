// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: string = '';
  password: string = '';

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    console.log('LoginComponent cargado');
  }

  onLogin(): void {
    console.log('--- onLogin disparado ---', this.usuario, this.password);

    this.loginService.verificarUsuario(this.usuario, this.password).subscribe({
      next: (ok: any) => {
        if (ok) {
          // Guardar rol en localStorage usando el servicio
          const rol = this.loginService.obtenerRol(); // Se asume que LoginService guarda el rol al verificar
          if (rol) {
            console.log('Usuario logueado con rol:', rol);
          }

          this.toastr.success('Usuario logueado con éxito', 'Éxito', {
            timeOut: 3000,
            positionClass: 'toast-top-center',
            closeButton: true,
            progressBar: true
          });

          // Limpiar campos
          this.usuario = '';
          this.password = '';

          // Redirigir a inicio
          this.router.navigate(['/inicio']);
        } else {
          this.toastr.error('Credenciales incorrectas', 'Error', {
            timeOut: 3000,
            positionClass: 'toast-top-center',
            closeButton: true,
            progressBar: true
          });
          this.usuario = '';
          this.password = '';
        }
      },
      error: (err: any) => {
        this.toastr.error('No se pudo conectar con el servidor', 'Error de Conexión', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
          closeButton: true,
          progressBar: true
        });
        console.error('Error al conectar con el servidor', err);
      }
    });
  }
}
