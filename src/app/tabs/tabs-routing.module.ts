import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'clientes',
        loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesPageModule)
      },
      {
        path: 'pagos',
        loadChildren: () => import('../pagos/pagos.module').then(m => m.PagosPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/clientes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/clientes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
