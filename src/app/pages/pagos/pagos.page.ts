import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Pago } from '../../interfaces/Pagos';

@Component({
  selector: 'app-pagos',
  templateUrl: 'pagos.page.html',
  styleUrls: ['pagos.page.scss']
})
export class PagosPage implements OnInit {

  pagosAgrupados: { fecha: string, pagos: any[] }[] = [];

  constructor(public clienteService: ClienteService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.agruparPagos();
  }

  agruparPagos() {
    const pagos = this.clienteService.pagos;
    const grupos: { [key: string]: any[] } = {};

    pagos.forEach(pago => {
      const fecha = new Date(pago.fechaPago).toLocaleDateString();
      if (!grupos[fecha]) {
        grupos[fecha] = [];
      }

      const cliente = this.clienteService.getClienteById(pago.idCliente);
      grupos[fecha].push({
        ...pago,
        nombreCliente: cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente desconocido'
      });
    });

    this.pagosAgrupados = Object.keys(grupos).map(fecha => ({
      fecha,
      pagos: grupos[fecha]
    })).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

}
