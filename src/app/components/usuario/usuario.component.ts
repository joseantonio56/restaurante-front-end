import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = {
    nombre: '',
    email: '',
    contrasena: '',  // Cambiado de contraseña a contrasena
    contraseña: '',
    rol: 'ROLE_USER',
    activo: true
  };
  editando: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (data) => {
        // Mapeamos contraseña de backend a contrasena en Angular
        this.usuarios = data.map(u => ({
          ...u,
          contrasena: (u as any).contraseña
        }));
      },
      error: () => this.toastr.error('Error al cargar usuarios', 'Error')
    });
  }

  guardarUsuario(): void {
    if (this.editando) {
      this.usuarioService.actualizarUsuario(this.nuevoUsuario).subscribe({
        next: () => {
          this.toastr.success('Usuario actualizado', 'OK');
          this.cargarUsuarios();
          this.resetForm();
        },
        error: () => this.toastr.error('Error al actualizar usuario', 'Error')
      });
    } else {
      this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe({
        next: () => {
          this.toastr.success('Usuario creado', 'OK');
          this.cargarUsuarios();
          this.resetForm();
        },
        error: () => this.toastr.error('Error al crear usuario', 'Error')
      });
    }
  }

  editarUsuario(usuario: Usuario): void {
    this.nuevoUsuario = { ...usuario };
    this.editando = true;
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.toastr.success('Usuario eliminado', 'OK');
          this.cargarUsuarios();
        },
        error: () => this.toastr.error('Error al eliminar usuario', 'Error')
      });
    }
  }

  resetForm(): void {
    this.nuevoUsuario = {
      nombre: '',
      email: '',
      contrasena: '', // Reiniciamos contrasena
      contraseña: '',
      rol: 'ROLE_USER',
      activo: true
    };
    this.editando = false;
  }
}
