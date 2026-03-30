import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Clientes';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss']
})
export class ClientesPage implements OnInit {

  clientesFiltrados: Cliente[] = [];
  textoBuscar = '';
  filtroEstado = 'todos'; // todos, deudores, al-corriente

  constructor(private router: Router,
    private alertCtrl: AlertController,
    public clienteService: ClienteService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.aplicarFiltros();
  }

  buscar(event: any) {
    this.textoBuscar = event.detail.value;
    this.aplicarFiltros();
  }

  cambiarFiltro(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    // 1. Empezar con todos los clientes
    let filtrados = [...this.clienteService.clientes];

    // 2. Filtrar por texto si existe
    if (this.textoBuscar.trim().length > 0) {
      const termino = this.textoBuscar.toLowerCase();
      filtrados = filtrados.filter(c => 
        c.nombre.toLowerCase().includes(termino) || 
        c.apellido?.toLowerCase().includes(termino)
      );
    }

    // 3. Filtrar por estado
    if (this.filtroEstado === 'deudores') {
      filtrados = filtrados.filter(c => {
        const estado = this.clienteService.getEstadoCliente(c.id);
        return estado.clase === 'danger' || estado.clase === 'warning';
      });
    } else if (this.filtroEstado === 'al-corriente') {
      filtrados = filtrados.filter(c => {
        const estado = this.clienteService.getEstadoCliente(c.id);
        return estado.clase === 'success';
      });
    }

    this.clientesFiltrados = filtrados;
  }

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
          handler: async () => {
            await this.clienteService.eliminarCliente(cliente.id);
            this.aplicarFiltros(); // Actualizar lista local
          }
        }
      ]
    });

    await alert.present();
  }
}
