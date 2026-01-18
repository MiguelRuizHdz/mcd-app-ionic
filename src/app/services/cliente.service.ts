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
}
