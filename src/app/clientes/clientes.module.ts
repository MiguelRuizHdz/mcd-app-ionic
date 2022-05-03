import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesPage } from './clientes.page';
import { ClientesPageRoutingModule } from './clientes-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
