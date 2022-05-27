import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Cliente } from '../../interfaces/Clientes';
import { ClienteService } from '../../services/cliente.service';
import { UiService as UiService } from '../../services/ui-service.service';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.page.html',
  styleUrls: ['./agregar-cliente.page.scss'],
})
export class AgregarClientePage implements OnInit {

  nuevoCliente: Cliente = {
    id: this.clienteService.idClienteContador,
    nombre: '',
    apellido: '',
    correo: '',
    direccion: '',
    telefono: 0,
    foto: '',
  };

  constructor(private clienteService: ClienteService,
    private uiService: UiService,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  addFoto(){
    this.uiService.presentToast('Proximamente');
  }

  guardarCliente( fNuevoCliente: NgForm ){


    if ( fNuevoCliente.invalid ) {
      this.uiService.presentToast('Llene los campos correctamente');
      return;
    }

    this.clienteService.guardarCliente(this.nuevoCliente);
    this.navCtrl.navigateBack('tabs/clientes');
  }

}
