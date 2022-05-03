import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagosPage } from './pagos.page';

import { PagosPageRoutingModule } from './pagos-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PagosPageRoutingModule
  ],
  declarations: [PagosPage]
})
export class PagosPageModule {}
