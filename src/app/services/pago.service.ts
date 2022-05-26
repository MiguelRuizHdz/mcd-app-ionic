import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { Pago } from '../interfaces/Pagos';
import { UiServiceService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  pagos: Pago[] = [];

  constructor(private storage: Storage,
              private uiService: UiServiceService) {
    this.storage.create();
    this.cargarPagos();
  }

  async guardarPago( pago: Pago ){
    this.pagos.unshift( pago );
    await this.storage.set('pagos', this.pagos );
    this.uiService.presentToast('Se agregó a pagos');
  }

  async cargarPagos(){
    const pagos = await this.storage.get('pagos');
    if ( pagos ){
      this.pagos = pagos;
    }
  }
}
