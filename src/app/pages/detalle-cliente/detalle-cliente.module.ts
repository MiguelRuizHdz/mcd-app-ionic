import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleClientePageRoutingModule } from './detalle-cliente-routing.module';

import { DetalleClientePage } from './detalle-cliente.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleClientePageRoutingModule,
    ComponentsModule
  ],
  declarations: [DetalleClientePage]
})
export class DetalleClientePageModule {}
