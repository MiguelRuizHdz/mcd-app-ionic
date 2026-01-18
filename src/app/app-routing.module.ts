import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'agregar-cliente',
    loadChildren: () => import('./pages/agregar-cliente/agregar-cliente.module').then(m => m.AgregarClientePageModule)
  },
  {
    path: 'detalle-cliente/:id',
    loadChildren: () => import('./pages/detalle-cliente/detalle-cliente.module').then(m => m.DetalleClientePageModule)
  },
  {
    path: 'editar-cliente/:id',
    loadChildren: () => import('./pages/editar-cliente/editar-cliente.module').then(m => m.EditarClientePageModule)
  },
  {
    path: 'nuevo-adeudo/:idCliente',
    loadChildren: () => import('./pages/nuevo-adeudo/nuevo-adeudo.module').then(m => m.NuevoAdeudoPageModule)
  },
  {
    path: 'detalle-adeudo/:id',
    loadChildren: () => import('./pages/detalle-adeudo/detalle-adeudo.module').then(m => m.DetalleAdeudoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
