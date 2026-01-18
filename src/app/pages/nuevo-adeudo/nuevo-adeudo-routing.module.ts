import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoAdeudoPage } from './nuevo-adeudo.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoAdeudoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoAdeudoPageRoutingModule {}
