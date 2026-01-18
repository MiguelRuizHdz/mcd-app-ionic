import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaAdeudosPage } from './lista-adeudos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaAdeudosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaAdeudosPageRoutingModule {}
