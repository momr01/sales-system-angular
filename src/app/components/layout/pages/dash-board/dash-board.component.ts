import { Component } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { DashBoardService } from 'src/app/services/dash-board.service';

//trabajar con graficos
Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashBoardComponent {
  totalIngresos: string = '0';
  totalVentas: string = '0';
  totalProductos: string = '0';

  constructor(private _dashboardService: DashBoardService) {}

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    const charBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [
          {
            label: '# de Ventas',
            data: dataGrafico,
            backgroundColor: ['rgba(54,162,235,0.2'],
            borderColor: ['rgba(54,162,235,1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, //para que se adapte a cambios en pantalla
        responsive: true,
        scales: {
          y: {
            beginAtZero: true, //que arranque en cero el eje y
          },
        },
      },
    });
  }

  ngOnInit(): void {
    this._dashboardService.resumen().subscribe({
      next: (data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          //informacion para pintar el grafico
          const arrayData: any[] = data.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);

          this.mostrarGrafico(labelTemp, dataTemp);
        }
      },
      error: (e) => console.log(e),
    });
  }
}
