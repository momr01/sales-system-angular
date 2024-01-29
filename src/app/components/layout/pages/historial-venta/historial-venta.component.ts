import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

//para trabajar con fechas
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

//importamos modal
import { ModalDetalleVentaComponent } from '../../modales/modal-detalle-venta/modal-detalle-venta.component';

import { Venta } from 'src/app/interfaces/venta';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

//formato de fechas - configuracion para calendario
export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATA_FORMATS,
    },
  ],
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    {
      value: 'fecha',
      descripcion: 'Por fechas',
    },
    { value: 'numero', descripcion: 'Por número venta' },
  ];
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroDocumento',
    'tipoPago',
    'total',
    'accion',
  ];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: [''],
    });

    //cdo cambia campo en formulario, nos suscribimos para obtener valor
    this.formularioBusqueda
      .get('buscarPor')
      ?.valueChanges.subscribe((value) => {
        this.formularioBusqueda.patchValue({
          numero: '',
          fechaInicio: '',
          fechaFin: '',
        });
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    //PAGINACION
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  //aplicar filtros a tabla al realizar busqueda
  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas() {
    let _fechaInicio: string = '';
    let _fechaFin: string = '';

    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format(
        'DD/MM/YYYY'
      );
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format(
        'DD/MM/YYYY'
      );

      //validar si es fecha valida
      if (_fechaInicio === 'invalid date' || _fechaFin === 'invalid date') {
        this._utilidadService.mostrarAlerta(
          'Debe ingresar ambas fechas',
          'Oops!'
        );
        return; //llega hasta aca, no continua
      }
    }

    this._ventaService
      .historial(
        this.formularioBusqueda.value.buscarPor,
        this.formularioBusqueda.value.numero,
        _fechaInicio,
        _fechaFin
      )
      .subscribe({
        next: (data) => {
          if (data.status) this.datosListaVenta = data.value;
          else
            this._utilidadService.mostrarAlerta(
              'No se encontraron datos',
              'Oops!'
            );
        },
        error: (e) => {},
      });
  }

  verDetalleVenta(_venta: Venta) {
    //abrimos modal para visualizar venta
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px',
    });
  }
}
