import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevoAdeudoPageRoutingModule } from './nuevo-adeudo-routing.module';

import { NuevoAdeudoPage } from './nuevo-adeudo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevoAdeudoPageRoutingModule
  ],
  declarations: [NuevoAdeudoPage]
})
export class NuevoAdeudoPageModule {}
