import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  constructor( private toastController: ToastController ) { }

  async presentToast( message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'bottom',
      duration: 1500
    });
    toast.present();
  }

}
