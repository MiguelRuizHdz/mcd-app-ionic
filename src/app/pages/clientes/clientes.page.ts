import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss']
})
export class ClientesPage {

  constructor(private router: Router) {}

  agregarCliente() {
    this.router.navigate(['agregar-cliente']);
  }
}
