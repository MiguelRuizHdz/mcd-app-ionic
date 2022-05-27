import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from '../interfaces/Clientes';
import { UiServiceService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clientes: Cliente[] = [];
  busquedaClientes: Cliente[] = [];

  constructor(private storage: Storage,
              private uiService: UiServiceService) {
    this.storage.create();
    this.cargarClientes();
  }

  async guardarCliente( cliente: Cliente ){
    this.clientes.unshift( cliente );
    await this.storage.set('clientes', this.clientes );
    this.uiService.presentToast('Se agregó a clientes');
  }

  async cargarClientes(){
    const clientes = await this.storage.get('clientes');
    if ( clientes ){
      this.clientes = clientes;
    }
  }

  buscarCliente( termino: string ) {
    this.busquedaClientes = [];
    for( const cliente of this.clientes ) {
      if (cliente.nombre.includes(termino) || cliente.apellido.includes(termino)) {
        this.busquedaClientes.unshift( cliente );
      }
    }

    return this.busquedaClientes;
  }

}
