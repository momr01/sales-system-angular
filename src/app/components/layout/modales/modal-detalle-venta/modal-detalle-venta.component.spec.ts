import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleVentaComponent } from './modal-detalle-venta.component';

describe('ModalDetalleVentaComponent', () => {
  let component: ModalDetalleVentaComponent;
  let fixture: ComponentFixture<ModalDetalleVentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetalleVentaComponent]
    });
    fixture = TestBed.createComponent(ModalDetalleVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
