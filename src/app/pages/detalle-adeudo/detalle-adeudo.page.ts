import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Adeudo } from '../../interfaces/Adeudos';
import { ClienteService } from '../../services/cliente.service';
import { Pago } from '../../interfaces/Pagos';

@Component({
  selector: 'app-detalle-adeudo',
  templateUrl: './detalle-adeudo.page.html',
  styleUrls: ['./detalle-adeudo.page.scss'],
})
export class DetalleAdeudoPage implements OnInit {

  adeudo: Adeudo | undefined;
  pagos: Pago[] = [];

  constructor(private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private navCtrl: NavController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.adeudo = this.clienteService.getAdeudoById(parseInt(id));
      this.pagos = this.clienteService.getPagosByAdeudo(parseInt(id));
    }
  }

  async pagarTotal() {
    if (!this.adeudo) return;
    this.realizarCobro(this.adeudo.aDeber || 0);
  }

  async pagarParcial() {
    const alert = await this.alertCtrl.create({
      header: 'Pago Parcial',
      inputs: [
        {
          name: 'monto',
          type: 'number',
          placeholder: '¿Cuánto pagará?',
          min: 1,
          max: this.adeudo?.aDeber
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Pagar',
          handler: (data) => {
            if (data.monto > 0) {
              this.realizarCobro(parseFloat(data.monto));
            }
          }
        }
      ]
    });

    await alert.present();
  }

  private async realizarCobro(monto: number) {
    if (!this.adeudo) return;

    const nuevoPago: Pago = {
      id: 0,
      idCliente: this.adeudo.idCliente,
      idAdeudo: this.adeudo.id,
      fechaPago: '',
      concepto: `Pago a: ${this.adeudo.concepto}`,
      monto: monto
    };

    await this.clienteService.registrarPago(nuevoPago);
    this.cargarDatos();

    // Si ya se liquidó, regresamos después de mostrar el cambio
    if (this.adeudo.aDeber === 0) {
      setTimeout(() => this.navCtrl.back(), 1500);
    }
  }

}
