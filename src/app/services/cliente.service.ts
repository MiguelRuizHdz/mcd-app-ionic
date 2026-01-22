import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from '../interfaces/Clientes';
import { Adeudo } from '../interfaces/Adeudos';
import { Pago } from '../interfaces/Pagos';
import { UiService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  idClienteContador = 0;
  idAdeudoContador = 0;
  idPagoContador = 0;

  clientes: Cliente[] = [];
  adeudos: Adeudo[] = [];
  pagos: Pago[] = [];
  busquedaClientes: Cliente[] = [];

  constructor(private storage: Storage,
    private platform: Platform,
    private uiService: UiService) {
    this.init();
  }

  async init() {
    await this.storage.create();
    await this.cargarClientes();
    await this.cargarAdeudos();
    await this.cargarPagos();
    await this.cargarContadores();
  }

  // --- CLIENTES ---

  async guardarCliente(cliente: Cliente) {
    const exists = this.clientes.find(c => c.id === cliente.id);
    if (cliente.id === -1 || !exists) {
      // Nuevo cliente
      cliente.id = this.idClienteContador;
      this.clientes.unshift(cliente);
      this.idClienteContador++;
    } else {
      // Editar cliente
      const index = this.clientes.findIndex(c => c.id === cliente.id);
      this.clientes[index] = cliente;
    }

    await this.saveData('clientes', this.clientes);
    await this.saveData('idClienteContador', this.idClienteContador);
    this.uiService.presentToast('Cliente guardado con éxito');
  }

  getClienteById(id: number) {
    return this.clientes.find(c => c.id === id);
  }

  async cargarClientes() {
    this.clientes = await this.getData('clientes') || [];
  }

  async eliminarCliente(id: number) {
    // 1. Eliminar pagos asociados al cliente
    this.pagos = this.pagos.filter(p => p.idCliente !== id);
    await this.saveData('pagos', this.pagos);

    // 2. Eliminar adeudos asociados al cliente
    this.adeudos = this.adeudos.filter(a => a.idCliente !== id);
    await this.saveData('adeudos', this.adeudos);

    // 3. Eliminar al cliente
    this.clientes = this.clientes.filter(c => c.id !== id);
    await this.saveData('clientes', this.clientes);

    this.uiService.presentToast('Cliente y sus datos eliminados');
  }

  getEstadoCliente(idCliente: number) {
    const adeudosPendientes = this.adeudos.filter(a => a.idCliente === idCliente && (a.aDeber || 0) > 0);

    if (adeudosPendientes.length === 0) {
      return { texto: 'Al corriente', clase: 'success' };
    }

    const hoy = new Date().toISOString().split('T')[0];
    const tieneRetraso = adeudosPendientes.some(a => {
      const fechaVence = (a.fechaPagarAntesDe || '').split('T')[0];
      return fechaVence && fechaVence < hoy;
    });

    if (tieneRetraso) {
      return { texto: 'Pago atrasado', clase: 'danger' };
    } else {
      return { texto: 'Pago pendiente', clase: 'warning' };
    }
  }

  // --- ADEUDOS ---

  async guardarAdeudo(adeudo: Adeudo) {
    if (adeudo.id === -1) {
      adeudo.id = this.idAdeudoContador;
      adeudo.fechaCreacion = new Date().toISOString();
      adeudo.aDeber = adeudo.precio;
      this.adeudos.unshift(adeudo);
      this.idAdeudoContador++;
    } else {
      const index = this.adeudos.findIndex(a => a.id === adeudo.id);
      if (index !== -1) {
        this.adeudos[index] = adeudo;
      }
    }

    await this.saveData('adeudos', this.adeudos);
    await this.saveData('idAdeudoContador', this.idAdeudoContador);
    this.uiService.presentToast('Adeudo registrado');
  }

  async cargarAdeudos() {
    this.adeudos = await this.getData('adeudos') || [];
  }

  getAdeudosByCliente(idCliente: number) {
    return this.adeudos.filter(a => a.idCliente === idCliente);
  }

  getAdeudoById(id: number) {
    return this.adeudos.find(a => a.id === id);
  }

  // --- PAGOS ---

  async registrarPago(pago: Pago) {
    pago.id = this.idPagoContador;
    pago.fechaPago = new Date().toISOString();
    this.pagos.unshift(pago);
    this.idPagoContador++;

    // Actualizar el adeudo relacionado
    const adeudo = this.adeudos.find(a => a.id === pago.idAdeudo);
    if (adeudo) {
      adeudo.aDeber = (adeudo.aDeber || 0) - (pago.monto || 0);
      if (adeudo.aDeber < 0) adeudo.aDeber = 0;
    }

    await this.saveData('pagos', this.pagos);
    await this.saveData('adeudos', this.adeudos);
    await this.saveData('idPagoContador', this.idPagoContador);
    this.uiService.presentToast('Pago registrado correctamente');
  }

  async cargarPagos() {
    this.pagos = await this.getData('pagos') || [];
  }

  getPagosByAdeudo(idAdeudo: number) {
    return this.pagos.filter(p => p.idAdeudo === idAdeudo);
  }

  getPagosByCliente(idCliente: number) {
    return this.pagos.filter(p => p.idCliente === idCliente);
  }

  // --- HELPERS ---

  private async saveData(key: string, value: any) {
    if (this.platform.is('capacitor')) {
      await this.storage.set(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  private async getData(key: string) {
    if (this.platform.is('capacitor')) {
      return await this.storage.get(key);
    } else {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }

  async cargarContadores() {
    this.idClienteContador = await this.getData('idClienteContador') || 0;
    this.idAdeudoContador = await this.getData('idAdeudoContador') || 0;
    this.idPagoContador = await this.getData('idPagoContador') || 0;
  }

  buscarCliente(termino: string) {
    termino = termino.toLowerCase();
    this.busquedaClientes = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(termino) ||
      c.apellido?.toLowerCase().includes(termino)
    );
    return this.busquedaClientes;
  }

  // --- IMPORT / EXPORT ---

  exportarDatos() {
    const data = {
      clientes: this.clientes,
      adeudos: this.adeudos,
      pagos: this.pagos,
      idClienteContador: this.idClienteContador,
      idAdeudoContador: this.idAdeudoContador,
      idPagoContador: this.idPagoContador,
      version: '1.0',
      fechaExportacion: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  async importarDatos(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);

      // Validación básica
      if (!data.clientes || !data.adeudos || !data.pagos) {
        throw new Error('Formato de archivo no válido');
      }

      // Actualizar estado interno
      this.clientes = data.clientes;
      this.adeudos = data.adeudos;
      this.pagos = data.pagos;
      this.idClienteContador = data.idClienteContador || 0;
      this.idAdeudoContador = data.idAdeudoContador || 0;
      this.idPagoContador = data.idPagoContador || 0;

      // Guardar todo en storage
      await this.saveData('clientes', this.clientes);
      await this.saveData('adeudos', this.adeudos);
      await this.saveData('pagos', this.pagos);
      await this.saveData('idClienteContador', this.idClienteContador);
      await this.saveData('idAdeudoContador', this.idAdeudoContador);
      await this.saveData('idPagoContador', this.idPagoContador);

      this.uiService.presentToast('Datos importados con éxito');
      return true;
    } catch (e) {
      console.error('Error al importar:', e);
      this.uiService.presentToast('Error al importar el archivo');
      return false;
    }
  }
}
