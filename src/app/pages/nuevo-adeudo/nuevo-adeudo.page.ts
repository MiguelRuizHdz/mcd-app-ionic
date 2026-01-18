import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Adeudo } from '../../interfaces/Adeudos';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-nuevo-adeudo',
  templateUrl: './nuevo-adeudo.page.html',
  styleUrls: ['./nuevo-adeudo.page.scss'],
})
export class NuevoAdeudoPage implements OnInit {

  adeudo: Adeudo = {
    id: -1,
    idCliente: 0,
    fechaCreacion: '',
    concepto: '',
    precio: 0,
    fechaPagarAntesDe: new Date().toISOString(),
    aDeber: 0
  };

  constructor(private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private navCtrl: NavController) { }

  ngOnInit() {
    const idCliente = this.activatedRoute.snapshot.paramMap.get('idCliente');
    if (idCliente) {
      this.adeudo.idCliente = parseInt(idCliente);
    }
  }

  crearAdeudo() {
    if (!this.adeudo.concepto || this.adeudo.concepto.length < 2 || (this.adeudo.precio || 0) <= 0) return;
    this.clienteService.guardarAdeudo(this.adeudo);
    this.navCtrl.back();
  }

}
