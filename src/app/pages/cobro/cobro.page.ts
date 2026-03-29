import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Adeudo } from '../../interfaces/Adeudos';
import { Pago } from '../../interfaces/Pagos';
import { NavController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
    selector: 'app-cobro',
    templateUrl: './cobro.page.html',
    styleUrls: ['./cobro.page.scss'],
})
export class CobroPage implements OnInit {

    adeudo: Adeudo | undefined;
    pago: any = {
        id: 0,
        idCliente: 0,
        idAdeudo: 0,
        fechaPago: '',
        monto: undefined,
        folio: '',
        comprobante: '',
        concepto: ''
    };


    constructor(
        private activatedRoute: ActivatedRoute,
        private clienteService: ClienteService,
        private navCtrl: NavController,
        private toastCtrl: ToastController
    ) { }

    ngOnInit() {
        const idAdeudo = this.activatedRoute.snapshot.paramMap.get('idAdeudo');
        const total = this.activatedRoute.snapshot.queryParamMap.get('total');

        if (idAdeudo) {
            this.adeudo = this.clienteService.getAdeudoById(parseInt(idAdeudo));
            if (this.adeudo) {
                this.pago.idCliente = this.adeudo.idCliente;
                this.pago.idAdeudo = this.adeudo.id;
                this.pago.concepto = `Pago a: ${this.adeudo.concepto}`;
                this.pago.monto = this.adeudo.aDeber;
            }
        }
    }

    async tomarFoto() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Prompt,
            promptLabelHeader: 'Comprobante de Pago',
            promptLabelPhoto: 'De la galería',
            promptLabelPicture: 'Tomar foto'
        });

        if (image.base64String) {
            this.pago.comprobante = `data:image/${image.format};base64,${image.base64String}`;
        }
    }

    async registrarPago() {
        if (!this.pago.monto || this.pago.monto <= 0) {
            this.presentToast('Ingrese un monto válido');
            return;
        }

        if (this.adeudo && this.pago.monto > this.adeudo.aDeber!) {
            this.presentToast('El monto no puede ser mayor al saldo pendiente');
            return;
        }

        await this.clienteService.registrarPago(this.pago);
        this.navCtrl.back();
    }

    async presentToast(message: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            position: 'bottom'
        });
        toast.present();
    }

}
