import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReciboTicketComponent } from './recibo-ticket/recibo-ticket.component';

@NgModule({
  declarations: [ReciboTicketComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ReciboTicketComponent]
})
export class ComponentsModule { }
