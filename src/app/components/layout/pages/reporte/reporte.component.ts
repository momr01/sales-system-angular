import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

//para trabajar con fechas
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';

import * as XLSX from 'xlsx';

import { Reporte } from 'src/app/interfaces/reporte';
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
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATA_FORMATS,
    },
  ],
})
export class ReporteComponent implements AfterViewInit {
  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = [
    'fechaRegistro',
    'numeroVenta',
    'tipoPago',
    'total',
    'producto',
    'cantidad',
    'precio',
    'totalProducto',
  ];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    //PAGINACION
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas() {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format(
      'DD/MM/YYYY'
    );
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format(
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

    this._ventaService.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadService.mostrarAlerta(
            'No se encontraron datos',
            'Oops!'
          );
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  //metodo para exportar excel
  exportarExcel() {
    const wb = XLSX.utils.book_new(); //libro
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte); //hoja

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte'); //libro, hoja, nombre de hoja
    XLSX.writeFile(wb, 'Reporte-Ventas.xlsx');
  }
}
