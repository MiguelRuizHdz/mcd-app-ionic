import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from '../interfaces/Clientes';
import { UiService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  idClienteContador = 0;

  clientes: Cliente[] = [];
  busquedaClientes: Cliente[] = [];

  constructor(private storage: Storage,
    private platform: Platform,
    private uiService: UiService) {
    this.storage.create();
    this.cargarClientes();
    this.cargarContadorId();
  }

  async guardarCliente(cliente: Cliente) {
    this.clientes.unshift(cliente);

    if (this.platform.is('capacitor')) {
      // dispositivo
      await this.storage.set('clientes', this.clientes);
    } else {
      // computadora
      localStorage.setItem('clientes', JSON.stringify(this.clientes));
    }

    this.uiService.presentToast('Se agregó a clientes');
    this.idClienteContador++;
  }

  async cargarClientes() {

    return new Promise(async (resolve, reject) => {

      if (this.platform.is('capacitor')) {
        // dispositivo
        await this.storage.get('clientes').then(clientes => {
          if (clientes) {
            this.clientes = clientes;
          }
          resolve(true);
        });
      } else {
        // computadora
        const clientesLocal = localStorage.getItem('clientes');
        if (clientesLocal) {
          // Existe clientes en el localStorage
          this.clientes = JSON.parse(clientesLocal);
        }
        resolve(true);
      }
    });

  }

  async cargarContadorId() {

    return new Promise(async (resolve, reject) => {

      if (this.platform.is('capacitor')) {
        // dispositivo
        await this.storage.get('idClienteContador').then(idCliente => {
          if (idCliente) {
            this.idClienteContador = idCliente;
          }
          resolve(true);
        });
      } else {
        // computadora
        const contadorLocal = localStorage.getItem('idClienteContador');
        if (contadorLocal) {
          // Existe idClienteContador en el localStorage
          this.idClienteContador = JSON.parse(contadorLocal);
        }
        resolve(true);
      }
    });

  }



  buscarCliente(termino: string) {
    this.busquedaClientes = [];
    for (const cliente of this.clientes) {
      if (cliente.nombre.includes(termino) || cliente.apellido?.includes(termino)) {
        this.busquedaClientes.unshift(cliente);
      }
    }

    return this.busquedaClientes;
  }

}
