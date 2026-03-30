import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/Clientes';
import { Adeudo } from 'src/app/interfaces/Adeudos';

@Component({
  selector: 'app-recibo-ticket',
  templateUrl: './recibo-ticket.component.html',
  styleUrls: ['./recibo-ticket.component.scss'],
})
export class ReciboTicketComponent implements OnInit {

  @Input() cliente: Cliente | undefined;
  @Input() adeudo: Adeudo | undefined;
  @Input() esRecordatorio: boolean = false;

  fechaActual = new Date();

  constructor() { }

  ngOnInit() {}

}
