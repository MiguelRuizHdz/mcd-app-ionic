import { Injectable } from '@angular/core';
import { LocalNotifications, ScheduleOptions, PendingResult } from '@capacitor/local-notifications';
import { Adeudo } from '../interfaces/Adeudos';
import { Cliente } from '../interfaces/Clientes';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  /**
   * Solicita permisos de notificación al usuario.
   */
  async requestPermissions() {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === 'denied') return false;
    if (status.display === 'prompt' || status.display === 'prompt-with-rationale') {
      const request = await LocalNotifications.requestPermissions();
      return request.display === 'granted';
    }
    return status.display === 'granted';
  }

  /**
   * Programa una notificación para el día de vencimiento de un adeudo a las 9:00 AM.
   */
  async programarRecordatorio(adeudo: Adeudo, cliente: Cliente) {
    if (!adeudo.fechaPagarAntesDe) return;

    // Cancelar cualquier notificación previa para este adeudo
    await this.cancelarRecordatorio(adeudo.id);

    const fechaVence = new Date(adeudo.fechaPagarAntesDe);
    
    // Configurar hora de notificación a las 9:00 AM del día de vencimiento
    fechaVence.setHours(9, 0, 0, 0);

    // No programar si la fecha ya pasó
    if (fechaVence < new Date()) {
        console.log('Fecha de notificación ya pasó, no se agenda.');
        return;
    }

    const options: ScheduleOptions = {
      notifications: [
        {
          title: 'Vencimiento de Adeudo 📢',
          body: `Hoy vence el pago de ${cliente.nombre} por concepto de "${adeudo.concepto || 'Adeudo'}". Saldo pendiente: $${adeudo.aDeber}`,
          id: adeudo.id, // Usamos el ID del adeudo como ID de la notificación
          schedule: { at: fechaVence },
          sound: 'default',
          attachments: [],
          actionTypeId: '',
          extra: { idAdeudo: adeudo.id }
        }
      ]
    };

    try {
      await LocalNotifications.schedule(options);
      console.log(`Recordatorio agendado para id:${adeudo.id} el ${fechaVence}`);
    } catch (error) {
      console.error('Error al programar notificación:', error);
    }
  }

  /**
   * Cancela una notificación programada.
   */
  async cancelarRecordatorio(idAdeudo: number) {
    try {
      const pending: PendingResult = await LocalNotifications.getPending();
      const notification = pending.notifications.find(n => n.id === idAdeudo);
      
      if (notification) {
        await LocalNotifications.cancel({ notifications: [{ id: idAdeudo }] });
        console.log(`Recordatorio cancelado para id:${idAdeudo}`);
      }
    } catch (error) {
      console.error('Error al cancelar notificación:', error);
    }
  }

  /**
   * Cancela todas las notificaciones (útil para pruebas o limpiezas fuertes).
   */
  async cancelarTodo() {
    await LocalNotifications.cancel({ notifications: (await LocalNotifications.getPending()).notifications });
  }

}
