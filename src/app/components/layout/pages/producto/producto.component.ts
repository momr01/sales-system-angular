import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'nombre',
    'categoria',
    'stock',
    'precio',
    'estado',
    'acciones',
  ];
  //inicializar origen de datos=
  dataInicio: Producto[] = [];

  //fuente de datos=
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog, //para poder mostrar los modales
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ) {}

  obtenerProductos() {
    this._productoService.lista().subscribe({
      next: (data) => {
        if (data.status) this.dataListaProductos.data = data.value;
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
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    //PAGINACION
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  //aplicar filtros a tabla al realizar busqueda
  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto() {
    this.dialog
      .open(ModalProductoComponent, {
        disableClose: true, //evitar que user pueda cerrar el modal con click afuera de este
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.obtenerProductos();
      });
  }

  editarProducto(producto: Producto) {
    this.dialog
      .open(ModalProductoComponent, {
        disableClose: true, //evitar que user pueda cerrar el modal con click afuera de este
        data: producto,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'true') this.obtenerProductos();
      });
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: 'Desea eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085D6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#D33',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      if (result.isConfirmed) {
        this._productoService.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta(
                'El producto fue eliminado',
                'Listo!'
              );
              this.obtenerProductos();
            } else {
              this._utilidadService.mostrarAlerta(
                'No fue posible eliminar el producto',
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
