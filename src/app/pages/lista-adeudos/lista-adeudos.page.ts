import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Adeudo } from '../../interfaces/Adeudos';
import { Cliente } from '../../interfaces/Clientes';

@Component({
  selector: 'app-lista-adeudos',
  templateUrl: './lista-adeudos.page.html',
  styleUrls: ['./lista-adeudos.page.scss'],
})
export class ListaAdeudosPage implements OnInit {

  cliente: Cliente | undefined;
  adeudosTodos: Adeudo[] = [];
  adeudosFiltrados: Adeudo[] = [];

  segmentoFiltro = 'pendientes';
  textoBuscar = '';

  constructor(private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const idCliente = this.activatedRoute.snapshot.paramMap.get('idCliente');
    if (idCliente) {
      this.cliente = this.clienteService.getClienteById(parseInt(idCliente));
      this.cargarAdeudos();
    }
  }

  cargarAdeudos() {
    if (this.cliente) {
      this.adeudosTodos = this.clienteService.getAdeudosByCliente(this.cliente.id);
      this.aplicarFiltros();
    }
  }

  aplicarFiltros() {
    let ad = [...this.adeudosTodos];

    // Filtro por segmento
    if (this.segmentoFiltro === 'pendientes') {
      ad = ad.filter(a => (a.aDeber || 0) > 0);
    } else {
      ad = ad.filter(a => (a.aDeber || 0) === 0);
    }

    // Filtro por búsqueda
    if (this.textoBuscar.trim().length > 0) {
      const query = this.textoBuscar.toLowerCase();
      ad = ad.filter(a => a.concepto && a.concepto.toLowerCase().includes(query));
    }

    this.adeudosFiltrados = ad;
  }

  cambioSegmento(event: any) {
    this.segmentoFiltro = event.detail.value;
    this.aplicarFiltros();
  }

  buscarAdeudo(event: any) {
    this.textoBuscar = event.detail.value;
    this.aplicarFiltros();
  }

  verDetalle(adeudo: Adeudo) {
    this.router.navigate(['/detalle-adeudo', adeudo.id]);
  }

}
