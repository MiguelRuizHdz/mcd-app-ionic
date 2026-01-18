import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleClientePage } from './detalle-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleClientePageRoutingModule {}
