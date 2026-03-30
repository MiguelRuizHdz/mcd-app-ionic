import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAdeudoPageRoutingModule } from './detalle-adeudo-routing.module';

import { DetalleAdeudoPage } from './detalle-adeudo.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAdeudoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DetalleAdeudoPage]
})
export class DetalleAdeudoPageModule {}
