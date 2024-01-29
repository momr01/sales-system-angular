import { Component } from '@angular/core';

import { Router } from '@angular/router'; //para poder redirigirnos entre paginas
import { Menu } from 'src/app/interfaces/menu';

import { MenuService } from 'src/app/services/menu.service';
import { UtilidadService } from 'src/app/reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  constructor(
    private _menuService: MenuService,
    private _utilidadService: UtilidadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = this._utilidadService.obtenerSesionUsuario();

    if (usuario != null) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      this._menuService.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if (data.status) this.listaMenus = data.value;
        },
        error: (e) => console.log(e),
      });
    }
  }

  cerrarSesion() {
    this._utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
