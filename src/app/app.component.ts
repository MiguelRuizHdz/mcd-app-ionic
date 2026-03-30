import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private notificationService: NotificationService) {}

  async ngOnInit() {
    // Solicitar permisos de notificación al iniciar la app
    const granted = await this.notificationService.requestPermissions();
    if (granted) {
      console.log('Permisos de notificación concedidos.');
    } else {
      console.log('Permisos de notificación denegados.');
    }
  }
}
