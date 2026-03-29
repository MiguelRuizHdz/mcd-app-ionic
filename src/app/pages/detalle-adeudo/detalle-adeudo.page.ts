import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Adeudo } from '../../interfaces/Adeudos';
import { ClienteService } from '../../services/cliente.service';
import { Pago } from '../../interfaces/Pagos';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

  async registrarPago() {
    if (!this.adeudo) return;
    this.navCtrl.navigateForward(`/cobro/${this.adeudo.id}`);
  }

  async confirmarEliminarAdeudo() {
    if (!this.adeudo) return;
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Adeudo',
      message: '¿Estás seguro de eliminar este adeudo? Se eliminarán también todos sus pagos asociados.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.clienteService.eliminarAdeudo(this.adeudo!.id);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarEliminarPago(idPago: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Pago',
      message: '¿Estás seguro de eliminar este pago? El saldo pendiente aumentará.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.clienteService.eliminarPago(idPago);
            this.cargarDatos();
          }
        }
      ]
    });
    await alert.present();
  }

  async adjuntarFotoExistente(pago: Pago) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Actualizar Comprobante',
        promptLabelPhoto: 'De la galería',
        promptLabelPicture: 'Tomar foto'
      });

      if (image.base64String) {
        pago.comprobante = `data:image/${image.format};base64,${image.base64String}`;
        await this.clienteService.actualizarPago(pago);
        this.cargarDatos();
      }
    } catch (e) {
      console.log('Cancelado');
    }
  }

}
