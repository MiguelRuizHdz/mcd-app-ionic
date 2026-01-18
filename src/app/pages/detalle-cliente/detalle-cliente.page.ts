import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Clientes';
import { Adeudo } from '../../interfaces/Adeudos';
import { Pago } from '../../interfaces/Pagos';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.page.html',
  styleUrls: ['./detalle-cliente.page.scss'],
})
export class DetalleClientePage implements OnInit {

  cliente: Cliente | undefined;
  adeudos: Adeudo[] = [];
  totalAdeudo = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.cliente = this.clienteService.getClienteById(parseInt(id));
      this.cargarAdeudos();
    }
  }

  cargarAdeudos() {
    if (this.cliente) {
      this.adeudos = this.clienteService.getAdeudosByCliente(this.cliente.id);
      this.totalAdeudo = this.adeudos.reduce((acc, current) => acc + (current.aDeber || 0), 0);
    }
  }

  editarCliente() {
    if (this.cliente) {
      this.router.navigate(['/editar-cliente', this.cliente.id]);
    }
  }

  nuevoAdeudo() {
    if (this.cliente) {
      this.router.navigate(['/nuevo-adeudo', this.cliente.id]);
    }
  }

  verAdeudo(adeudo: Adeudo) {
    this.router.navigate(['/detalle-adeudo', adeudo.id]);
  }

  verListaCompleta() {
    if (this.cliente) {
      this.router.navigate(['/lista-adeudos', this.cliente.id]);
    }
  }

  // Acciones de contacto
  llamar() {
    if (this.cliente?.telefono) window.open(`tel:${this.cliente.telefono}`, '_system');
  }

  mensaje() {
    if (this.cliente?.telefono) window.open(`sms:${this.cliente.telefono}`, '_system');
  }

  correo() {
    if (this.cliente?.correo) window.open(`mailto:${this.cliente.correo}`, '_system');
  }

  verMapa() {
    if (this.cliente?.direccion) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.cliente.direccion)}`;
      window.open(url, '_system');
    }
  }

  // Selección múltiple
  modoSeleccion = false;
  adeudosSeleccionados: number[] = [];

  toggleSeleccion(idAdeudo: number) {
    if (!this.modoSeleccion) {
      const adeudo = this.adeudos.find(a => a.id === idAdeudo);
      if (adeudo) this.verAdeudo(adeudo);
      return;
    }

    const index = this.adeudosSeleccionados.indexOf(idAdeudo);
    if (index > -1) {
      this.adeudosSeleccionados.splice(index, 1);
    } else {
      this.adeudosSeleccionados.push(idAdeudo);
    }
  }

  toggleModoSeleccion() {
    this.modoSeleccion = !this.modoSeleccion;
    this.adeudosSeleccionados = [];
  }

  pagarSeleccionados() {
    if (this.adeudosSeleccionados.length === 0) return;

    this.adeudosSeleccionados.forEach(id => {
      const adeudo = this.adeudos.find(a => a.id === id);
      if (adeudo && (adeudo.aDeber || 0) > 0) {
        const nuevoPago: Pago = {
          id: 0,
          idCliente: adeudo.idCliente,
          idAdeudo: adeudo.id,
          fechaPago: '',
          concepto: `Pago total multi: ${adeudo.concepto}`,
          monto: adeudo.aDeber
        };
        this.clienteService.registrarPago(nuevoPago);
      }
    });

    this.toggleModoSeleccion();
    this.cargarAdeudos();
  }
}
