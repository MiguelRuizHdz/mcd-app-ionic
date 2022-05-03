import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.page.html',
  styleUrls: ['./agregar-cliente.page.scss'],
})
export class AgregarClientePage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  addFoto(){

  }

  guardarCliente(){
    this.navCtrl.navigateBack('tabs/clientes');  
  }

}
