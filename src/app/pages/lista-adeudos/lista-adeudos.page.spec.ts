import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAdeudosPage } from './lista-adeudos.page';

describe('ListaAdeudosPage', () => {
  let component: ListaAdeudosPage;
  let fixture: ComponentFixture<ListaAdeudosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAdeudosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
