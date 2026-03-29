import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Pago } from '../../interfaces/Pagos';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pagos',
  templateUrl: 'pagos.page.html',
  styleUrls: ['pagos.page.scss']
})
export class PagosPage implements OnInit {

  pagosAgrupados: { fecha: string, pagos: any[] }[] = [];

  constructor(public clienteService: ClienteService,
    private alertCtrl: AlertController) { }

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

  async confirmarEliminarPago(idPago: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Pago',
      message: '¿Estás seguro de eliminar este pago? El saldo pendiente de la deuda aumentará.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.clienteService.eliminarPago(idPago);
            this.agruparPagos();
          }
        }
      ]
    });
    await alert.present();
  }

}
