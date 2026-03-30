import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LoadingController, ToastController } from '@ionic/angular';
import domtoimage from 'dom-to-image-more';
import { Cliente } from '../interfaces/Clientes';
import { Adeudo } from '../interfaces/Adeudos';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private readonly PREFIJO_DEFAULT = '52'; // Ejemplo para México

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  /**
   * Normaliza el número de teléfono añadiendo el prefijo si falta.
   */
  private normalizarTelefono(telefono: string | number | undefined): string {
    if (!telefono) return '';
    let telStr = telefono.toString().replace(/\D/g, ''); // Solo números
    
    // Si no tiene prefijo (asumiendo 10 dígitos para México sin prefijo)
    if (telStr.length === 10) {
      telStr = this.PREFIJO_DEFAULT + telStr;
    }
    
    return telStr;
  }

  /**
   * Abre WhatsApp con un mensaje predefinido.
   */
  enviarMensajeTexto(cliente: Cliente, mensaje: string) {
    const tel = this.normalizarTelefono(cliente.telefono);
    if (!tel) {
      this.presentToast('Error: Cliente sin teléfono válido', 'danger');
      return;
    }

    const url = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  /**
   * Captura un elemento HTML utilizando dom-to-image-more y lo comparte.
   * Genera la imagen con una resolución 3x para máxima nitidez (HD).
   */
  async compartirReciboImagen(elementId: string, cliente: Cliente, nombreArchivo: string = 'recibo.png') {
    const loading = await this.loadingCtrl.create({
      message: 'Preparando recibo HD...',
      spinner: 'circles'
    });
    await loading.present();

    // Pequeño delay adicional para asegurar que las fuentes rendericen bien
    await new Promise(resolve => setTimeout(resolve, 400));

    const element = document.getElementById(elementId) as HTMLElement;
    if (!element) {
      await loading.dismiss();
      this.presentToast(`Error: Diseño no encontrado (${elementId})`, 'danger');
      return;
    }

    try {
      loading.message = 'Renderizando en alta calidad...';

      // Implementar factor de escala x3
      const scale = 3;
      const originalWidth = element.clientWidth;
      const originalHeight = element.clientHeight;

      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: '#ffffff',
        width: originalWidth * scale,
        height: originalHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${originalWidth}px`,
          height: `${originalHeight}px`
        }
      });

      // Limpiar prefijo Base64
      const base64Data = dataUrl.split(',')[1];
      
      loading.message = 'Guardando imagen HD...';
      const fileName = `${Date.now()}_${nombreArchivo}`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache
      });

      await loading.dismiss();

      // Abrir menú nativo para compartir
      await Share.share({
        title: 'Recibo MCD App',
        text: `Recibo de pago para ${cliente.nombre}`,
        files: [savedFile.uri],
        dialogTitle: 'Enviar por WhatsApp'
      });

    } catch (error: any) {
      await loading.dismiss();
      console.error('Fallo técnico con dom-to-image HD:', error);
      this.presentToast(`Error crítico: ${error.message || 'Error en conversión HD'}`, 'danger');
    }
  }

  /**
   * Presenta un Toast rápido
   */
  private async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 5000, 
      color,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  /**
   * Genera un mensaje de recordatorio de pago.
   */
  generarMensajeCobro(cliente: Cliente, adeudo: Adeudo): string {
    const monto = adeudo.aDeber || 0;
    const fecha = adeudo.fechaPagarAntesDe ? new Date(adeudo.fechaPagarAntesDe).toLocaleDateString() : 'Pendiente';
    
    return `Hola ${cliente.nombre}, te envío el detalle de tu pago pendiente.\n\n` +
           `Concepto: ${adeudo.concepto || 'Sin concepto'}\n` +
           `Monto a deber: $${monto}\n` +
           `Fecha límite: ${fecha}\n\n` +
           `¡Gracias!`;
  }

  /**
   * Genera un mensaje de estado de cuenta general.
   */
  generarMensajeEstadoGeneral(cliente: Cliente, totalAdeudo: number): string {
    return `Hola ${cliente.nombre}, te envío un resumen de tu cuenta.\n\n` +
           `Saldo Total Pendiente: $${totalAdeudo}\n\n` +
           `Por favor, ponte en contacto si tienes alguna duda.`;
  }
}
