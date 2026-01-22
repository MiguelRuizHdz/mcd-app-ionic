import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Cliente } from '../../interfaces/Clientes';
import { ClienteService } from '../../services/cliente.service';
import { UiService as UiService } from '../../services/ui-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.page.html',
  styleUrls: ['./agregar-cliente.page.scss'],
})
export class AgregarClientePage implements OnInit {

  nuevoCliente: Cliente = {
    id: -1,
    nombre: '',
    apellido: '',
    correo: '',
    direccion: '',
    telefono: undefined,
    foto: '',
  };

  constructor(private clienteService: ClienteService,
    private uiService: UiService,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  async addFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      promptLabelHeader: 'Elegir foto',
      promptLabelPhoto: 'De la galería',
      promptLabelPicture: 'Tomar foto'
    });

    if (image.base64String) {
      this.nuevoCliente.foto = `data:image/${image.format};base64,${image.base64String}`;
    }
  }

  guardarCliente(fNuevoCliente: NgForm) {
    if (fNuevoCliente.invalid) {
      this.uiService.presentToast('Llene los campos correctamente');
      return;
    }

    if (this.nuevoCliente.telefono) {
      const telStr = String(this.nuevoCliente.telefono).replace(/\s+/g, '');
      this.nuevoCliente.telefono = telStr ? Number(telStr) : undefined;
    }

    this.clienteService.guardarCliente(this.nuevoCliente);
    this.navCtrl.navigateBack('tabs/clientes');
  }

}
