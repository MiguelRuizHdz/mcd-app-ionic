import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Clientes';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss']
})
export class ClientesPage {

  constructor(private router: Router,
    private alertCtrl: AlertController,
    public clienteService: ClienteService) { }

  agregarCliente() {
    this.router.navigate(['agregar-cliente']);
  }

  verDetalle(cliente: any) {
    this.router.navigate(['/detalle-cliente', cliente.id]);
  }

  async confirmarEliminar(cliente: Cliente) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar cliente?',
      message: `Esta acción borrará a ${cliente.nombre} y todos sus datos permanentemente.`,
      mode: 'ios',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.clienteService.eliminarCliente(cliente.id);
          }
        }
      ]
    });

    await alert.present();
  }
}
