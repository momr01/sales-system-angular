import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'nombreCompleto',
    'correo',
    'rolDescripcion',
    'estado',
    'acciones',
  ];
  //inicializar origen de datos=
  dataInicio: Usuario[] = [];

  //fuente de datos=
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog, //para poder mostrar los modales
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {}

  obtenerUsuarios() {
    this._usuarioService.lista().subscribe({
      next: (data) => {
        if (data.status) this.dataListaUsuarios.data = data.value;
        else
          this._utilidadService.mostrarAlerta(
            'No se encontraron datos',
            'Oops!'
          );
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    //PAGINACION
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  //aplicar filtros a tabla al realizar busqueda
  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario() {
    this.dialog
      .open(ModalUsuarioComponent, {
        disableClose: true, //evitar que user pueda cerrar el modal con click afuera de este
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.obtenerUsuarios();
      });
  }

  editarUsuario(usuario: Usuario) {
    this.dialog
      .open(ModalUsuarioComponent, {
        disableClose: true, //evitar que user pueda cerrar el modal con click afuera de este
        data: usuario,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.obtenerUsuarios();
      });
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085D6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#D33',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta(
                'El usuario fue eliminado',
                'Listo!'
              );
              this.obtenerUsuarios();
            } else {
              this._utilidadService.mostrarAlerta(
                'No fue posible eliminar el usuario',
                'Error!'
              );
            }
          },
          error: (e) => {},
        });
      }
    });
  }
}
