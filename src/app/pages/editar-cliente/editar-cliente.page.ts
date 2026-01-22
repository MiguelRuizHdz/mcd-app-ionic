import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../interfaces/Clientes';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.page.html',
  styleUrls: ['./editar-cliente.page.scss'],
})
export class EditarClientePage implements OnInit {

  cliente: Cliente = {
    id: -1,
    nombre: '',
    apellido: '',
    correo: '',
    direccion: '',
    telefono: undefined,
    foto: '',
  };

  constructor(private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router,
    private navCtrl: NavController) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      const resp = this.clienteService.getClienteById(parseInt(id));
      if (resp) {
        this.cliente = { ...resp };
        if (this.cliente.telefono) {
          const telStr = String(this.cliente.telefono).replace(/\s+/g, '');
          this.cliente.telefono = telStr ? Number(telStr) : undefined;
        }
      }
    }
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
      this.cliente.foto = `data:image/${image.format};base64,${image.base64String}`;
    }
  }

  guardarCliente(fEditarCliente: NgForm) {
    if (fEditarCliente.invalid) return;
    if (this.cliente.telefono) {
      const telStr = String(this.cliente.telefono).replace(/\s+/g, '');
      this.cliente.telefono = telStr ? Number(telStr) : undefined;
    }
    this.clienteService.guardarCliente(this.cliente);
    this.navCtrl.back();
  }

}
