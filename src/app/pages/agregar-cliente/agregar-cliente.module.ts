import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarClientePageRoutingModule } from './agregar-cliente-routing.module';

import { AgregarClientePage } from './agregar-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarClientePageRoutingModule
  ],
  declarations: [AgregarClientePage]
})
export class AgregarClientePageModule {}
