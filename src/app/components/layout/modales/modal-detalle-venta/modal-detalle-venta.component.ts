import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/interfaces/venta';
import { DetalleVenta } from 'src/app/interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css'],
})
export class ModalDetalleVentaComponent implements OnInit {
  //propiedades de venta
  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  total: string = '';
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = _venta.fechaRegistro!; //la propiedad que vamos a recibir no sera null
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago; //estos no necesitan sigo de exclamacion porque sabemos que no seran null, en interface Venta vemos eso
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
  }

  ngOnInit(): void {}
}
