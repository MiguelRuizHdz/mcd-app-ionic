import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss']
})
export class ClientesPage {

  constructor(private router: Router,
    public clienteService: ClienteService) { }

  agregarCliente() {
    this.router.navigate(['agregar-cliente']);
  }

  verDetalle(cliente: any) {
    this.router.navigate(['/detalle-cliente', cliente.id]);
  }
}
