import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaAdeudosPageRoutingModule } from './lista-adeudos-routing.module';

import { ListaAdeudosPage } from './lista-adeudos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaAdeudosPageRoutingModule
  ],
  declarations: [ListaAdeudosPage]
})
export class ListaAdeudosPageModule {}
