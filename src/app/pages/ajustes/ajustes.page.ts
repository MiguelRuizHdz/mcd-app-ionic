import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { UiService } from '../../services/ui-service.service';

@Component({
    selector: 'app-ajustes',
    templateUrl: './ajustes.page.html',
    styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

    constructor(
        public clienteService: ClienteService,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private platform: Platform,
        private uiService: UiService
    ) { }

    ngOnInit() {
    }

    async exportarDB() {
        const loading = await this.loadingCtrl.create({
            message: 'Generando archivo...',
        });
        await loading.present();

        try {
            const data = this.clienteService.exportarDatos();
            const now = new Date();
            const fecha = now.toISOString().split('T')[0];
            const hora = now.getHours().toString().padStart(2, '0') + '-' + now.getMinutes().toString().padStart(2, '0');
            const fileName = `backup_mcd_${fecha}_${hora}.mcdb`;

            if (this.platform.is('capacitor')) {
                // Lógica para Móvil (Native)
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: data,
                    directory: Directory.Cache,
                    encoding: Encoding.UTF8,
                });

                await Share.share({
                    title: 'Copia de Seguridad MCD',
                    text: 'Aquí está tu copia de seguridad de la base de datos MCD.',
                    url: result.uri,
                    dialogTitle: 'Compartir base de datos',
                });

            } else {
                // Lógica para Web
                const blob = new Blob([data], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');

                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error al exportar:', error);
            this.uiService.presentToast('Error al generar el archivo');
        } finally {
            loading.dismiss();
        }
    }

    async confirmarImportar() {
        const alert = await this.alertCtrl.create({
            header: 'Confirmar Importación',
            message: '¿Estás seguro? Se sobrescribirán todos los datos actuales con los del archivo seleccionado. Esta acción no se puede deshacer.',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Importar',
                    handler: () => {
                        this.seleccionarArchivo();
                    }
                }
            ]
        });

        await alert.present();
    }

    seleccionarArchivo() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mcdb';

        input.onchange = (event: any) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e: any) => {
                    const contents = e.target.result;
                    await this.clienteService.importarDatos(contents);
                };
                reader.readAsText(file);
            }
        };

        input.click();
    }

}
