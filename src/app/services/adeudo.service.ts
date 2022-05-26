import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { Adeudo } from '../interfaces/Adeudos';
import { UiServiceService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class AdeudoService {

  adeudos: Adeudo[] = [];

  constructor(private storage: Storage,
              private uiService: UiServiceService) {
    this.storage.create();
    this.cargarAdeudos();
  }

  async guardarAdeudo( adeudo: Adeudo ){
    this.adeudos.unshift( adeudo );
    await this.storage.set('adeudos', this.adeudos );
    this.uiService.presentToast('Se agregó a adeudos');
  }

  async cargarAdeudos(){
    const adeudos = await this.storage.get('adeudos');
    if ( adeudos ){
      this.adeudos = adeudos;
    }
  }
}
