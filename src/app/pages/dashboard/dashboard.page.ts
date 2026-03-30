import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  totalDeuda = 0;
  totalClientes = 0;
  adeudosPendientesCount = 0;
  totalOriginal = 0;
  porcentajeRecuperado = 0;
  
  topDeudores: any[] = [];

  constructor(public clienteService: ClienteService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.calcularMetricas();
  }

  calcularMetricas() {
    this.totalClientes = this.clienteService.clientes.length;
    
    // Suma de lo que deben actualmente
    this.totalDeuda = this.clienteService.adeudos.reduce((sum, a) => sum + (a.aDeber || 0), 0);
    
    // Suma del precio original de todos los adeudos
    this.totalOriginal = this.clienteService.adeudos.reduce((sum, a) => sum + (a.precio || 0), 0);
    
    // Conteo de adeudos no liquidados
    this.adeudosPendientesCount = this.clienteService.adeudos.filter(a => (a.aDeber || 0) > 0).length;

    // Porcentaje de cobranza
    if (this.totalOriginal > 0) {
      const cobrado = this.totalOriginal - this.totalDeuda;
      this.porcentajeRecuperado = (cobrado / this.totalOriginal);
    } else {
      this.porcentajeRecuperado = 0;
    }

    // Top 5 Deudores
    this.topDeudores = this.clienteService.clientes
      .map(c => {
        const adeudoTotal = this.clienteService.adeudos
          .filter(a => a.idCliente === c.id)
          .reduce((sum, a) => sum + (a.aDeber || 0), 0);
        return { ...c, totalDeuda: adeudoTotal };
      })
      .filter(c => c.totalDeuda > 0)
      .sort((a, b) => b.totalDeuda - a.totalDeuda)
      .slice(0, 5);
  }

}
